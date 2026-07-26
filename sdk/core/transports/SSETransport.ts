import type { Transport } from './Transport';
import { ensureContextSource } from '@/core/helpers/ensureContextSource';
import { logger } from '@/core/helpers/logger';

export interface SseTransportConfig {
  endpoint: string;
  apiKey: string;
  context: any;
  wrapper?: { name: string; version: string };

  // THE ISOMORPHIC FIX: Allow passing a custom EventSource implementation class
  EventSourceImpl?: any;
}

/**
 * A Server-Sent Events (SSE) transport implementation responsible for
 * maintaining a persistent streaming connection to the Flagmint platform.
 *
 * The transport establishes an authenticated SSE connection, receives
 * real-time feature flag updates, and notifies the FlagClient whenever the
 * active flag set changes. It also supports context synchronization, allowing
 * feature flags to be re-evaluated without recreating the streaming session.
 *
 * To improve reliability, the transport automatically:
 * - Waits for the initial feature flag payload before completing initialization.
 * - Serializes context update requests to prevent stale flag evaluations.
 * - Detects connection failures and performs exponential backoff reconnection.
 * - Refreshes single-use session credentials before reconnecting when a
 *   refresh callback is provided.
 * - Cleans up event listeners and internal state during teardown to prevent
 *   memory leaks.
 *
 * @template C The shape of the evaluation context sent to the Flagmint server.
 * @template T The feature flag value type returned by the platform.
 *
 * @implements {Transport<C, T>}
 */
export class SseTransport<C, T> implements Transport<C, T> {
  private eventSource: EventSource | null = null;
  private flags: Record<string, T> = {};
  private context: C;
  private connectionId: string | null = null;
  private onFlagsUpdatedCallback?: (flags: Record<string, T>) => void;

  private initialFlagsReceived = false;
  private initialFlagsResolve: (() => void) | null = null;
  private initialFlagsReject: ((err: Error) => void) | null = null;
  private nextFlagsResolve: (() => void) | null = null;

  // Improvement #1: Store connection execution promise to avoid dual-invocation races
  private connectPromise: Promise<void> | null = null;

  // Improvement #3: Retain explicit references for complete teardown operations
  private connectionListener?: (event: MessageEvent) => void;
  private flagsListener?: (event: MessageEvent) => void;

  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;

  constructor(
    private endpoint: string,
    private sessionId: string,
    initialContext: C,
    private refreshTokenCallback?: () => Promise<string>,
    private configOptions?: Partial<SseTransportConfig>
  ) {
    this.context = ensureContextSource(initialContext);
  }

  async init(): Promise<void> {
    if (this.initialFlagsReceived) return;

    const initializationPromise = new Promise<void>((resolve, reject) => {
      this.initialFlagsResolve = resolve;
      this.initialFlagsReject = reject;
    });

    // Fire the shared connection promise sequence
    await this.connect().catch((err) => {
      this.initialFlagsReject?.(err);
      this.resetInitialResolvers();
      throw err;
    });

    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<void>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Timeout waiting for initial feature flags stream packet from server.'));
      }, 5000);
    });

    try {
      await Promise.race([initializationPromise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId!);
    }
  }

  async fetchFlags(context: C): Promise<Record<string, T>> {
    this.context = ensureContextSource(context);
    
    if (!this.connectionId) {
      throw new Error('SSE configuration update blocked: stream connection not active.');
    }

    // THE SEPARATION FIX: Check if running inside a concurrent Node.js/Backend Server env
    const isServerEnvironment = typeof window === 'undefined';

    if (isServerEnvironment) {
      // Backend Server Mode: Perform a completely stateless evaluation call
      // This allows thousands of parallel API controller requests to fetch rules safely 
      // concurrently without using locks or interrupting the long-lived SSE update line.
      const response = await fetch(`${this.endpoint}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId: this.connectionId,
          context: this.context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server execution evaluation loop failed (${response.status})`);
      }

      const payload = await response.json();
      return payload.flags ?? {};
    }

    // Improvement #5: Hard reject parallel context calls to avoid delivering stale configurations
    if (this.nextFlagsResolve) {
      throw new Error('Context update already in progress. Please await current modification cycles.');
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    const nextFlagsPromise = new Promise<void>((resolve) => {
      this.nextFlagsResolve = resolve;
      timeoutId = setTimeout(() => {
        logger.warn('[SseTransport] Delta configuration broadcast exceeded timeout limits. Yielding cached array.');
        resolve();
      }, 3000);
    });

    try {
      const response = await fetch(`${this.endpoint}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId: this.connectionId,
          context: this.context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server failed context synchronization routine (${response.status})`);
      }

      await nextFlagsPromise;
    } finally {
      clearTimeout(timeoutId!);
      this.nextFlagsResolve = null;
    }

    return this.flags;
  }

  onFlagsUpdated(callback: (flags: Record<string, T>) => void): void {
    this.onFlagsUpdatedCallback = callback;
  }

  destroy(): void {
    logger.log('[SseTransport] Initiating clean class resource teardown...');
    this.cleanupEventSource();
    this.flags = {};
    this.onFlagsUpdatedCallback = undefined;
    this.resetInitialResolvers();
    this.nextFlagsResolve = null;
  }

  private cleanupEventSource(): void {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    if (this.eventSource) {
      if (this.connectionListener) {
        this.eventSource.removeEventListener('connected', this.connectionListener);
      }
      if (this.flagsListener) {
        this.eventSource.removeEventListener('flags', this.flagsListener);
      }
      // Improvement #7: Pass the un-allocated direct named handler block down cleanly
      this.eventSource.removeEventListener('heartbeat', this.handleHeartbeat);

      this.eventSource.close();
      this.eventSource = null;
    }
    this.connectionId = null;
    this.connectPromise = null;

    // Improvement #3: Completely drop closure bindings to avoid memory leaks
    this.connectionListener = undefined;
    this.flagsListener = undefined;
  }

  private async connect(): Promise<void> {
    // Improvement #1: Resolve with the active in-flight connection promise layout if active
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {
      const base64Context = btoa(JSON.stringify(this.context));
      // 1. Extract environment variables natively
      const sdkVersion = __SDK_VERSION__; // Replaced automatically by your rollup/vite build step
      const platform = typeof window !== 'undefined' ? 'browser' : 'nodejs';

      // 2. Append non-invasive telemetry parameters safely to the stream handshake URL
      // Extract the optional wrapper framework details or fallback to 'native'
      const wrapperName = this.configOptions?.wrapper?.name || 'native-js';
      const wrapperVersion = this.configOptions?.wrapper?.version || 'none';

      // Append the framework metrics securely to the streaming query string
      const url = `${this.endpoint}/stream?` +
        `sessionId=${encodeURIComponent(this.sessionId)}&` +
        `context=${encodeURIComponent(base64Context)}&` +
        `sdkVersion=${encodeURIComponent(sdkVersion)}&` +
        `platform=${encodeURIComponent(platform)}&` +
        `wrapperName=${encodeURIComponent(wrapperName)}&` +
        `wrapperVersion=${encodeURIComponent(wrapperVersion)}`;

      let ChosenEventSource: any = null;

      if (this.configOptions?.EventSourceImpl) {
        // 1. User supplied an explicit implementation (ideal for Node.js)
        ChosenEventSource = this.configOptions.EventSourceImpl;
      } else if (typeof window !== 'undefined' && (window as any).EventSource) {
        // 2. Fallback to native browser API if running inside a browser environment
        ChosenEventSource = (window as any).EventSource;
      } else if (typeof global !== 'undefined' && (global as any).EventSource) {
        // 3. Fallback to global server attachments if available
        ChosenEventSource = (global as any).EventSource;
      }

      if (!ChosenEventSource) {
        this.connectPromise = null;
        return reject(
          new Error(
            '[FlagmintSDK] EventSource implementation is missing. ' +
            'If you are running inside a Node.js server environment, you must explicitly ' +
            'pass an implementation class (e.g., from the "eventsource" npm package) ' +
            'via the EventSourceImpl configuration option.'
          )
        );
      }
      this.eventSource = new ChosenEventSource(url);

      // Improvement #8: Standardized naming choices ('Listener' instead of 'Handler')
      this.connectionListener = this.createConnectionListener(resolve, reject);
      this.flagsListener = this.createFlagsListener();
      console.log(this.eventSource)
      this.eventSource?.addEventListener('connected', this.connectionListener);
      this.eventSource?.addEventListener('flags', this.flagsListener);
      this.eventSource?.addEventListener('heartbeat', this.handleHeartbeat);
      if (this.eventSource) {
        this.eventSource.onerror = (err) => {
          logger.error('[SseTransport] Native network pipeline alert layer triggered.', err);

          // Improvement #6: Only reject the promise if network errors interrupt the initial connect sequence
          if (this.connectPromise && !this.initialFlagsReceived) {
            this.cleanupEventSource();
            reject(new Error('Initial SSE connection stream setup rejected by infrastructure gateway.'));
            this.initialFlagsReject?.(new Error('Handshake failure.'));
            this.resetInitialResolvers();
            return
          }

          // 2. Force an active client-side reconnection loop with backoff
          // If the stream was already alive and dropped later (e.g. server reloads), 
          // do not let the browser give up. Force a structured retry cycle.
          this.scheduleActiveReconnection();
        };
      }
    });

    return this.connectPromise;
  }

  // --- Listener Factory Mappings ---

  private scheduleActiveReconnection(): void {
    // Clear any existing scheduled retries to prevent overlapping loops
    if (this.reconnectTimeoutId) clearTimeout(this.reconnectTimeoutId);

    // Calculate exponential backoff interval (caps at 15 seconds maximum)
    this.reconnectAttempts++;
    const backoffDelay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 15000);

    logger.log(`[SseTransport] Disconnected. Scheduling retry #${this.reconnectAttempts} in ${backoffDelay}ms...`);

    this.cleanupEventSource();

    this.reconnectTimeoutId = setTimeout(async () => {
      try {
        // NOTE: In production, the client app should re-fetch a fresh token/sessionId 
        // from ff authentication handler endpoint right here before calling connect() 
        // so it avoids hitting the 401 token-already-deleted error!
        if (this.refreshTokenCallback) {
          logger.log('[SseTransport] Refreshing single-use token credentials before reconnection...');
          this.sessionId = await this.refreshTokenCallback();
        }

        await this.connect();
      } catch (err) {
        logger.warn('[SseTransport] Reconnection attempt failed. Waiting for next cycle.');
        // Loop continues automatically because connect() failure will hit onerror again
      }
    }, backoffDelay);
  }

  private createConnectionListener(resolve: () => void, reject: (err: any) => void) {
    return (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);
        this.connectionId = payload.connectionId;
        logger.log(`[SseTransport] Stream channel synchronized with remote identifier: ${this.connectionId}`);

        this.reconnectAttempts = 0;

        // Improvement #2: Pull handshake listener definitions immediately after successful setup
        if (this.eventSource && this.connectionListener) {
          this.eventSource.removeEventListener('connected', this.connectionListener);
          this.connectionListener = undefined;
        }

        resolve();
      } catch (err) {
        this.cleanupEventSource();
        reject(err);
      }
    };
  }

  private createFlagsListener() {
    return (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);
        this.flags = payload.flags ?? {};

        this.onFlagsUpdatedCallback?.(this.flags);

        if (!this.initialFlagsReceived) {
          this.initialFlagsReceived = true;
          this.initialFlagsResolve?.();
          // Improvement #4: Fully drop reference pointers together upon validation completion
          this.resetInitialResolvers();
        }

        if (this.nextFlagsResolve) {
          this.nextFlagsResolve();
          this.nextFlagsResolve = null;
        }
      } catch (err) {
        logger.warn('[SseTransport] Failed structural parsing on streaming data packet:', err);
      }
    };
  }

  // Improvement #7: Clean, simplified direct functional binding
  private handleHeartbeat = (): void => {
    logger.log('[SseTransport] ♥ streaming link heartbeat verified.');
  };

  private resetInitialResolvers(): void {
    // Improvement #4: Abstracted cleanup helper
    this.initialFlagsResolve = null;
    this.initialFlagsReject = null;
  }
}