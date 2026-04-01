// core/transports/WebSocketTransport.ts
import type { Transport } from './Transport';
import { ensureContextSource } from '@/core/helpers/ensureContextSource';
import { logger } from '@/core/helpers/logger';

type WebSocketConstructor = new (url: string, protocols?: string | string[]) => WebSocketLike;

interface WebSocketLike {
  readyState: number;
  send(data: string | ArrayBufferLike): void;
  close(): void;
  onopen: ((event: Event) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
}

interface CloseEvent extends Event {
  code: number;
  reason?: string;
  wasClean?: boolean;
}

enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'failed';

export class WebSocketTransport<C, T> implements Transport<C, T> {
  private socket: WebSocketLike | null = null;
  private flags: Record<string, T> = {};
  private context: C | null = null;
  private isReady: boolean = false;
  private initialFlagsReceived = false;
  private initialFlagsPromise: Promise<void> | null = null;
  private onFlagsUpdatedCallback?: (flags: Record<string, T>) => void;
  private onConnectionStateCallback?: (state: ConnectionState) => void;
  private retries = 0;
  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private wsUrl: string,
    private apiKey: string,
    private maxRetries: number = 5,
    private initialBackoffMs: number = 1000
  ) { }

  async init(): Promise<void> {
    await this.connectWithRetry();
    // Wait for initial flags
    await this.waitForInitialFlags();
  }

  private waitForInitialFlags(): Promise<void> {
    if (this.initialFlagsReceived) {
      return Promise.resolve();
    }

    if (!this.initialFlagsPromise) {
      this.initialFlagsPromise = new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.initialFlagsReceived) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          logger.warn('[WebSocketTransport] Initial flags timeout');
          resolve();
        }, 5000);
      });
    }

    return this.initialFlagsPromise;
  }

  private connectWithRetry(): Promise<void> {
    return new Promise((resolve, reject) => {
      const connect = () => {
        try {
          // Clean up old socket
          this.cleanupSocket();

          this.setConnectionState('connecting');
          const WebSocketImpl = this.getWebSocketImplementation();

          this.socket = new WebSocketImpl(`${this.wsUrl}?apiKey=${this.apiKey}`);

          this.socket.onopen = () => {
            logger.log('[WebSocketTransport] Connected');
            this.isReady = true;
            this.retries = 0;
            this.setConnectionState('connected');

            if (this.context) {
              this.sendContext(this.context);
            }
            resolve();
          };

          this.socket.onmessage = (event: MessageEvent) => {

            try {
              const data = JSON.parse(event.data as string);
              logger.log('[WebSocketTransport] Message received:', data);
              // Respond to ping
              // ✅ CORRECT - Respond to ping with pong
              if (data.type === 'ping') {
                if (this.socket && this.socket.readyState === WebSocketReadyState.OPEN) {
                  this.socket.send(JSON.stringify({ type: 'pong' }));
                }
                return;
              }

              // ✅ CORRECT - Just acknowledge pong received
              if (data.type === 'pong') {
                logger.log('[WebSocketTransport] Pong received');
                // Don't send anything back!
                return;
              }

              if (data.type === 'flags') {
                logger.log('[WebSocketTransport] Flags update received');
                this.flags = data.flags;
                this.initialFlagsReceived = true;
                this.onFlagsUpdatedCallback?.(this.flags);
              }
            } catch (err) {
              logger.warn('[WebSocketTransport] Failed to parse message:', err);
            }
          };

          this.socket.onerror = (err: Event) => {
            logger.error('[WebSocketTransport] Error:', err);
          };

          this.socket.onclose = (event: CloseEvent) => {
            logger.log('[WebSocketTransport] Connection closed:', event.code);
            this.isReady = false;
            this.setConnectionState('disconnected');

            // Auth failure codes
            if (event.code === 1008 || event.code === 4001) {
              this.setConnectionState('failed');
              reject(new Error('Unauthorized: Invalid API key'));
              return;
            }

            // Retry logic
            if (this.retries < this.maxRetries) {
              const delay = this.initialBackoffMs * Math.pow(2, this.retries);
              logger.warn(
                `[WebSocketTransport] Reconnecting in ${delay}ms (attempt ${this.retries + 1})`
              );

              this.setConnectionState('reconnecting');
              this.reconnectTimeoutId = setTimeout(connect, delay);
              this.retries++;
            } else {
              this.setConnectionState('failed');
              reject(new Error(`WebSocket failed after ${this.retries} retries`));
            }
          };
        } catch (err) {
          logger.error('[WebSocketTransport] Failed to create socket:', err);
          this.setConnectionState('failed');
          reject(err);
        }
      };

      connect();
    });
  }

  private cleanupSocket() {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;

      if (this.socket.readyState === WebSocketReadyState.OPEN) {
        this.socket.close();
      }

      this.socket = null;
    }
  }

  private setConnectionState(state: ConnectionState) {
    this.onConnectionStateCallback?.(state);
  }

  private getWebSocketImplementation(): WebSocketConstructor {
    if (typeof WebSocket !== 'undefined') {
      return WebSocket as WebSocketConstructor;
    }

    try {
      const ws = require('ws');
      return ws.default || ws;
    } catch (err) {
      throw new Error(
        'WebSocket not available. Install "ws" package for Node.js: npm install ws'
      );
    }
  }

  async fetchFlags(context: C): Promise<Record<string, T>> {
    this.context = ensureContextSource(context);

    if (this.isReady && this.socket?.readyState === WebSocketReadyState.OPEN) {
      this.sendContext(this.context);
      if (!this.initialFlagsReceived) {
        await this.waitForInitialFlags();
      } else {
        // For subsequent fetches, wait a bit for update
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return this.flags;
  }

  onFlagsUpdated(callback: (flags: Record<string, T>) => void): void {
    this.onFlagsUpdatedCallback = callback;
  }

  onConnectionStateChanged(callback: (state: ConnectionState) => void): void {
    this.onConnectionStateCallback = callback;
  }

  destroy(): void {
    logger.log('[WebSocketTransport] Destroying...');

    if (this.reconnectTimeoutId !== null) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    this.cleanupSocket();

    this.flags = {};
    this.context = null;
    this.isReady = false;
    this.initialFlagsReceived = false;
    this.initialFlagsPromise = null;
    this.onFlagsUpdatedCallback = undefined;
    this.onConnectionStateCallback = undefined;
    this.retries = 0;
  }

  private sendContext(context: C): void {
    if (!this.socket || this.socket.readyState !== WebSocketReadyState.OPEN) {
      logger.warn('[WebSocketTransport] Socket not ready, cannot send context');
      return;
    }

    const payload = JSON.stringify({
      type: 'context',
      context: ensureContextSource(context),
    });
    this.socket.send(payload);
  }
}
