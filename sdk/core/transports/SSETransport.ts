import type { Transport } from './Transport';
import { ensureContextSource } from '@/core/helpers/ensureContextSource';
import { logger } from '@/core/helpers/logger';

export interface SseTransportConfig {
  endpoint: string;
  apiKey: string;
  context: any;
  wrapper?: { name: string; version: string };
  EventSourceImpl?: any;
}

const INITIAL_FLAGS_TIMEOUT_MS = 5000;
const CONTEXT_UPDATE_TIMEOUT_MS = 5000;
const MAX_RECONNECT_DELAY_MS = 15000;

/**
 * Encodes evaluation context as URL-safe base64 matching FF-EU's
 * `Buffer.from(encodedContext, 'base64').toString('utf8')` decoder.
 */
function encodeContextQueryParam(context: unknown): string {
  const json = JSON.stringify(context);
  let base64: string;
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    base64 = Buffer.from(json, 'utf8').toString('base64');
  } else {
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  }
  return encodeURIComponent(base64);
}

function createSdkError(
  message: string,
  code: string,
  extra?: Record<string, unknown>
): Error {
  const err = new Error(message);
  Object.assign(err, { code, ...extra });
  return err;
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function parseEventData(event: MessageEvent): Record<string, any> {
  try {
    const parsed = JSON.parse(event.data);
    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function isQuotaEvent(payload: Record<string, any>): boolean {
  return (
    payload.statusCode === 429 ||
    payload.error === 'QUOTA_EXCEEDED' ||
    typeof payload.retryAfter === 'number'
  );
}

/**
 * A Server-Sent Events (SSE) transport implementation responsible for
 * maintaining a persistent streaming connection to the Flagmint platform.
 *
 * Handshake: `POST /auth/asl-handshake` issues a single-use sessionId.
 * Stream: `GET {endpoint}/stream?sessionId&context&sdkVersion&platform&wrapper*`
 *   emits `connected` then `flags`. Heartbeats are SSE comments (`: heartbeat`)
 *   and are not visible to EventSource — they only keep the TCP connection alive.
 * Context: `POST {endpoint}/context` with `x-api-key` returns 202 and the
 *   re-evaluated flags arrive on the existing stream after a 400ms debounce.
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
  private onErrorCallback?: (error: Error) => void;

  private initialFlagsReceived = false;
  private initialFlagsResolve: (() => void) | null = null;
  private initialFlagsReject: ((err: Error) => void) | null = null;
  private nextFlagsResolve: (() => void) | null = null;

  private connectPromise: Promise<void> | null = null;
  private connectResolve: (() => void) | null = null;
  private connectReject: ((err: Error) => void) | null = null;

  private connectionListener?: (event: MessageEvent) => void;
  private flagsListener?: (event: MessageEvent) => void;
  private quotaListener?: (event: MessageEvent) => void;
  private errorListener?: (event: MessageEvent) => void;

  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private terminalClose = false;
  private contextUpdateQueue: Promise<void> = Promise.resolve();

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

    await this.connect().catch((err) => {
      this.resetInitialResolvers();
      throw err;
    });

    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<void>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Timeout waiting for initial feature flags stream packet from server.'));
      }, INITIAL_FLAGS_TIMEOUT_MS);
    });

    try {
      await Promise.race([initializationPromise, timeoutPromise]);
    } catch (err) {
      this.terminalClose = true;
      this.cleanupEventSource();
      this.resetInitialResolvers();
      throw err;
    } finally {
      clearTimeout(timeoutId!);
    }
  }

  /**
   * POST /v2/flags/context. FF-EU always returns 202 and pushes the next
   * `flags` event on the open SSE stream (after a 400ms debounce). The HTTP
   * body does not contain evaluated flags — browser and Node share this path.
   */
  async fetchFlags(context: C, options?: { persist?: boolean }): Promise<Record<string, T>> {
    const pendingContext = ensureContextSource(context);

    const previous = this.contextUpdateQueue;
    let release!: () => void;
    this.contextUpdateQueue = new Promise<void>((resolve) => {
      release = resolve;
    });

    try {
      await previous;
      if (options?.persist !== false) {
        this.context = pendingContext;
      }
      return await this.performContextUpdate(pendingContext);
    } finally {
      release();
    }
  }

  onFlagsUpdated(callback: (flags: Record<string, T>) => void): void {
    this.onFlagsUpdatedCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  destroy(): void {
    logger.log('[SseTransport] Initiating clean class resource teardown...');
    this.terminalClose = true;
    this.cleanupEventSource();
    this.flags = {};
    this.onFlagsUpdatedCallback = undefined;
    this.onErrorCallback = undefined;
    this.resetInitialResolvers();
    this.nextFlagsResolve = null;
  }

  private get apiKey(): string {
    return this.configOptions?.apiKey ?? '';
  }

  private applyFlags(nextFlags: Record<string, T>): void {
    this.flags = nextFlags;
    this.onFlagsUpdatedCallback?.(this.flags);

    if (!this.initialFlagsReceived) {
      this.initialFlagsReceived = true;
      this.initialFlagsResolve?.();
      this.resetInitialResolvers();
    }

    if (this.nextFlagsResolve) {
      this.nextFlagsResolve();
      this.nextFlagsResolve = null;
    }
  }

  private emitError(err: Error, options: { rejectInit?: boolean } = {}): void {
    if (options.rejectInit && !this.initialFlagsReceived) {
      if (this.connectReject) {
        this.connectReject(err);
        this.connectReject = null;
        this.connectResolve = null;
        this.resetInitialResolvers();
        return;
      }
      this.initialFlagsReject?.(err);
      this.resetInitialResolvers();
      return;
    }
    this.onErrorCallback?.(err);
  }

  private async performContextUpdate(context: C): Promise<Record<string, T>> {
    if (!this.connectionId) {
      throw new Error('SSE configuration update blocked: stream connection not active.');
    }

    if (!this.apiKey) {
      throw createSdkError(
        'SSE context update requires an API key.',
        'ERR_AUTH'
      );
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    const nextFlagsPromise = new Promise<void>((resolve) => {
      this.nextFlagsResolve = resolve;
      timeoutId = setTimeout(() => {
        logger.warn('[SseTransport] Delta configuration broadcast exceeded timeout limits. Yielding cached array.');
        resolve();
      }, CONTEXT_UPDATE_TIMEOUT_MS);
    });

    const abortController = new AbortController();
    const abortId = setTimeout(() => abortController.abort(), CONTEXT_UPDATE_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.endpoint}/context`, {
        method: 'POST',
        signal: abortController.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          connectionId: this.connectionId,
          context,
        }),
      });

      if (response.status === 429) {
        const payload = await this.safeReadJson(response);
        this.handleQuotaPayload(payload, { fromHttp: true });
        throw createSdkError(
          payload.message || 'Monthly evaluation limit exceeded.',
          'ERR_RATE_LIMITED',
          this.quotaExtra(payload)
        );
      }

      if (response.status === 401 || response.status === 403) {
        throw createSdkError(
          'Unauthorized: Invalid API key',
          'ERR_AUTH'
        );
      }

      if (response.status === 404) {
        this.scheduleActiveReconnection();
        throw new Error('SSE connection is not found or is dead. Reconnecting...');
      }

      if (!response.ok) {
        throw new Error(`Server failed context synchronization routine (${response.status})`);
      }

      // 202 Accepted: flags arrive on the stream after the server debounce window.
      await nextFlagsPromise;
    } finally {
      clearTimeout(timeoutId!);
      clearTimeout(abortId);
      if (this.nextFlagsResolve) {
        this.nextFlagsResolve = null;
      }
    }

    return this.flags;
  }

  private async safeReadJson(response: Response): Promise<Record<string, any>> {
    try {
      return (await response.json()) as Record<string, any>;
    } catch {
      return {};
    }
  }

  private quotaExtra(payload: Record<string, any>): Record<string, unknown> {
    const retryAfter = typeof payload.retryAfter === 'number' ? payload.retryAfter : undefined;
    return {
      retryAfter,
      resetTime:
        typeof retryAfter === 'number'
          ? new Date(Date.now() + retryAfter * 1000).toISOString()
          : undefined,
      upgradeUrl: payload.upgradeUrl,
      statusCode: payload.statusCode ?? 429,
    };
  }

  private handleQuotaPayload(
    payload: Record<string, any>,
    options: { fromHttp?: boolean } = {}
  ): void {
    const hadInitialFlags = this.initialFlagsReceived;
    const cachedFlags = payload.data;
    const hasCachedFlags =
      cachedFlags && typeof cachedFlags === 'object' && !Array.isArray(cachedFlags);

    if (hasCachedFlags) {
      this.applyFlags(cachedFlags as Record<string, T>);
    }

    if (options.fromHttp) {
      return;
    }

    const err = createSdkError(
      payload.message || 'Monthly evaluation limit exceeded.',
      'ERR_RATE_LIMITED',
      this.quotaExtra(payload)
    );

    this.terminalClose = true;

    if (!hadInitialFlags && !hasCachedFlags) {
      this.emitError(err, { rejectInit: true });
    } else {
      this.connectResolve?.();
      this.connectResolve = null;
      this.connectReject = null;
      this.onErrorCallback?.(err);
    }

    this.cleanupEventSource();
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
      if (this.quotaListener) {
        this.eventSource.removeEventListener('quota_exceeded', this.quotaListener);
      }
      if (this.errorListener) {
        this.eventSource.removeEventListener('error', this.errorListener);
      }
      this.eventSource.onerror = null;
      this.eventSource.close();
      this.eventSource = null;
    }
    this.connectionId = null;
    this.connectPromise = null;
    this.connectResolve = null;
    this.connectReject = null;
    this.connectionListener = undefined;
    this.flagsListener = undefined;
    this.quotaListener = undefined;
    this.errorListener = undefined;
  }

  private resolveEventSourceImpl(): any {
    if (this.configOptions?.EventSourceImpl) {
      return this.configOptions.EventSourceImpl;
    }
    if (typeof window !== 'undefined' && (window as any).EventSource) {
      return (window as any).EventSource;
    }
    if (typeof globalThis !== 'undefined' && (globalThis as any).EventSource) {
      return (globalThis as any).EventSource;
    }
    return null;
  }

  private async connect(): Promise<void> {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {
      this.connectResolve = resolve;
      this.connectReject = reject;
      const sdkVersion = typeof __SDK_VERSION__ !== 'undefined' ? __SDK_VERSION__ : 'unknown';
      const platform = typeof window !== 'undefined' ? 'browser' : 'nodejs';
      const wrapperName = this.configOptions?.wrapper?.name || 'native-js';
      const wrapperVersion = this.configOptions?.wrapper?.version || 'none';

      const url =
        `${this.endpoint}/stream?` +
        `sessionId=${encodeURIComponent(this.sessionId)}&` +
        `context=${encodeContextQueryParam(this.context)}&` +
        `sdkVersion=${encodeURIComponent(sdkVersion)}&` +
        `platform=${encodeURIComponent(platform)}&` +
        `wrapperName=${encodeURIComponent(wrapperName)}&` +
        `wrapperVersion=${encodeURIComponent(wrapperVersion)}`;

      const ChosenEventSource = this.resolveEventSourceImpl();
      if (!ChosenEventSource) {
        this.connectPromise = null;
        this.connectReject = null;
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
      this.connectionListener = this.createConnectionListener(resolve, reject);
      this.flagsListener = this.createFlagsListener();
      this.quotaListener = this.createQuotaListener();
      this.errorListener = this.createStreamErrorListener();

      this.eventSource?.addEventListener('connected', this.connectionListener);
      this.eventSource?.addEventListener('flags', this.flagsListener);
      this.eventSource?.addEventListener('quota_exceeded', this.quotaListener);
      this.eventSource?.addEventListener('error', this.errorListener);

      if (this.eventSource) {
        this.eventSource.onerror = () => {
          if (this.terminalClose) {
            this.cleanupEventSource();
            return;
          }

          logger.error('[SseTransport] Native network pipeline alert layer triggered.');

          if (this.connectReject && !this.initialFlagsReceived) {
            const err = new Error('Initial SSE connection stream setup rejected by infrastructure gateway.');
            this.cleanupEventSource();
            reject(err);
            return;
          }

          this.scheduleActiveReconnection();
        };
      }
    });

    return this.connectPromise;
  }

  private scheduleActiveReconnection(): void {
    if (this.terminalClose) return;

    if (this.reconnectTimeoutId) clearTimeout(this.reconnectTimeoutId);

    this.reconnectAttempts++;
    const backoffDelay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), MAX_RECONNECT_DELAY_MS);

    logger.log(`[SseTransport] Disconnected. Scheduling retry #${this.reconnectAttempts} in ${backoffDelay}ms...`);

    this.cleanupEventSource();

    this.reconnectTimeoutId = setTimeout(async () => {
      try {
        if (this.refreshTokenCallback) {
          logger.log('[SseTransport] Refreshing single-use token credentials before reconnection...');
          this.sessionId = await this.refreshTokenCallback();
        }

        await this.connect();
      } catch (err) {
        logger.warn('[SseTransport] Reconnection attempt failed. Waiting for next cycle.');
        this.scheduleActiveReconnection();
      }
    }, backoffDelay);
  }

  private createConnectionListener(resolve: () => void, reject: (err: any) => void) {
    return (event: MessageEvent) => {
      try {
        const payload = parseEventData(event);
        if (typeof payload.connectionId !== 'string' || !payload.connectionId) {
          throw new Error('SSE `connected` event did not carry a connectionId.');
        }
        this.connectionId = payload.connectionId;
        logger.log(`[SseTransport] Stream channel synchronized with remote identifier: ${this.connectionId}`);

        this.reconnectAttempts = 0;
        this.connectResolve = null;
        this.connectReject = null;

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
        const payload = parseEventData(event);
        if (!isPlainObject(payload.flags)) {
          logger.warn('[SseTransport] Ignoring flags event without a flags object.');
          return;
        }
        this.applyFlags(payload.flags as Record<string, T>);
      } catch (err) {
        logger.warn('[SseTransport] Failed structural parsing on streaming data packet:', err);
      }
    };
  }

  private createQuotaListener() {
    return (event: MessageEvent) => {
      const payload = parseEventData(event);
      if (!isQuotaEvent(payload)) {
        logger.warn('[SseTransport] Ignoring quota event without a quota payload.');
        return;
      }
      this.handleQuotaPayload(payload);
    };
  }

  /**
   * Named `error` events from FF-EU (`event: error`) after the stream is hijacked.
   * Distinct from EventSource.onerror, which fires on network/connection failure.
   */
  private createStreamErrorListener() {
    return (event: MessageEvent) => {
      // Named SSE `event: error` from FF-EU is a MessageEvent with JSON data.
      // EventSource also fires a generic `error` Event on connection drop — ignore those here.
      if (typeof event.data !== 'string' || !event.data) return;

      const payload = parseEventData(event);
      if (typeof payload.error !== 'string' || !payload.error) {
        logger.warn('[SseTransport] Ignoring named error event without an error code.');
        return;
      }
      const errorCode = payload.error;
      const err = createSdkError(`SSE stream error: ${errorCode}`, this.mapStreamErrorCode(errorCode));

      const retryable = errorCode === 'session_id_missing' || errorCode === 'internal_error';
      this.terminalClose = !retryable;
      this.emitError(err, { rejectInit: !this.initialFlagsReceived });
      this.cleanupEventSource();

      if (retryable && this.initialFlagsReceived) {
        this.terminalClose = false;
        this.scheduleActiveReconnection();
      }
    };
  }

  private mapStreamErrorCode(errorCode: string): string {
    switch (errorCode) {
      case 'session_id_missing':
      case 'invalid_api_key':
      case 'subscription_inactive':
        return 'ERR_AUTH';
      case 'invalid_context':
        return 'ERR_INVALID_CONTEXT';
      default:
        return 'ERR_INTERNAL';
    }
  }

  private resetInitialResolvers(): void {
    this.initialFlagsResolve = null;
    this.initialFlagsReject = null;
  }
}
