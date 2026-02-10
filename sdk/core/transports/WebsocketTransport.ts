// core/transports/WebSocketTransport.ts
import type { Transport } from './Transport';

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
  private heartbeatIntervalId: ReturnType<typeof setInterval> | null = null;
  private lastHeartbeatTime = 0;
  private readonly heartbeatTimeoutMs = 30000; // 30 seconds

  constructor(
    private wsUrl: string,
    private apiKey: string,
    private maxRetries: number = 5,
    private initialBackoffMs: number = 1000
  ) {}

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
          console.warn('[WebSocketTransport] Initial flags timeout');
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
            console.log('[WebSocketTransport] Connected');
            this.isReady = true;
            this.retries = 0;
            this.setConnectionState('connected');
            
            if (this.context) {
              this.sendContext(this.context);
            }
            
            this.startHeartbeat();
            resolve();
          };

          this.socket.onmessage = (event: MessageEvent) => {
            this.lastHeartbeatTime = Date.now();
            
            try {
              const data = JSON.parse(event.data as string);
              
              if (data.type === 'pong') {
                // Heartbeat response
                return;
              }
              
              if (data.type === 'flags') {
                console.log('[WebSocketTransport] Flags update received');
                this.flags = data.flags;
                this.initialFlagsReceived = true;
                this.onFlagsUpdatedCallback?.(this.flags);
              }
            } catch (err) {
              console.warn('[WebSocketTransport] Failed to parse message:', err);
            }
          };

          this.socket.onerror = (err: Event) => {
            console.error('[WebSocketTransport] Error:', err);
          };

          this.socket.onclose = (event: CloseEvent) => {
            console.log('[WebSocketTransport] Connection closed:', event.code);
            this.isReady = false;
            this.stopHeartbeat();
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
              console.warn(
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
          console.error('[WebSocketTransport] Failed to create socket:', err);
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

  private startHeartbeat() {
    this.lastHeartbeatTime = Date.now();
    
    this.heartbeatIntervalId = setInterval(() => {
      const now = Date.now();
      
      // Check if connection is dead
      if (now - this.lastHeartbeatTime > this.heartbeatTimeoutMs) {
        console.warn('[WebSocketTransport] Heartbeat timeout, reconnecting...');
        this.socket?.close();
        return;
      }

      // Send ping
      if (this.socket?.readyState === WebSocketReadyState.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 10000); // Check every 10s
  }

  private stopHeartbeat() {
    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
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
    this.context = context;

    if (this.isReady && this.socket?.readyState === WebSocketReadyState.OPEN) {
      this.sendContext(context);
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
    console.log('[WebSocketTransport] Destroying...');
    
    this.stopHeartbeat();
    
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
      console.warn('[WebSocketTransport] Socket not ready, cannot send context');
      return;
    }

    const payload = JSON.stringify({ type: 'context', context });
    this.socket.send(payload);
  }
}
