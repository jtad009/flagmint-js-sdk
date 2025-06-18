// core/transports/WebSocketTransport.ts
// This WebSocketTransport class implements the Transport interface for real-time flag updates
// using WebSockets. It connects to a WebSocket server, sends the context when ready,
// and listens for flag updates. The flags can be accessed via the fetchFlags method,
// and updates can be handled through the onFlagsUpdated callback. The destroy method cleans up the connection.
import type { Transport } from './Transport';

export class WebSocketTransport<C, T> implements Transport<C, T> {
    private socket: WebSocket | null = null;
    private flags: Record<string, T> = {};
    private context: C | null = null;
    private isReady: boolean = false;
    private onFlagsUpdatedCallback?: (flags: Record<string, T>) => void;
    private retries = 0;

    constructor(
        private wsUrl: string,
        private apiKey: string,
        private maxRetries: number = 5,
        private initialBackoffMs: number = 1000
    ) { }

    async init(): Promise<void> {
        return this.connectWithRetry();
    }

    /**
     * Attempts to connect to the WebSocket server with retry logic.
     * If the connection fails, it will retry with exponential backoff.
     */
    private connectWithRetry(): Promise<void> {
        return new Promise((resolve, reject) => {
            const connect = () => {
                this.socket = new WebSocket(`${this.wsUrl}?apiKey=${this.apiKey}`);

                this.socket.onopen = () => {
                    this.isReady = true;
                    this.retries = 0;
                    if (this.context) {
                        this.sendContext(this.context);
                    }
                    resolve();
                };

                this.socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'flags') {
                            this.flags = data.flags;
                            this.onFlagsUpdatedCallback?.(this.flags);
                        }
                    } catch (err) {
                        console.warn('Failed to parse WebSocket message:', err);
                    }
                };

                this.socket.onerror = (err) => {
                    console.error('[WebSocketTransport] Error:', err);
                    // Don't reject here — we handle failure/retry in onclose
                };

                this.socket.onclose = (event) => {
                    this.isReady = false;

                    if (event.code === 1008 || event.code === 4001) {
                        reject(new Error('Unauthorized: Invalid API key'));
                    } else if (this.retries < this.maxRetries) {
                        const delay = this.initialBackoffMs * Math.pow(2, this.retries);
                        console.warn(`[WebSocketTransport] Reconnecting in ${delay}ms (attempt ${this.retries + 1})`);
                        setTimeout(connect, delay);
                        this.retries++;
                    } else {
                        reject(new Error(`WebSocket failed after ${this.retries} retries`));
                    }
                };
            };

            connect();
        });
    }
    async fetchFlags(context: C): Promise<Record<string, T>> {
        this.context = context;

        if (this.isReady && this.socket?.readyState === WebSocket.OPEN) {
            this.sendContext(context);
        }

        return this.flags;
    }

    onFlagsUpdated(callback: (flags: Record<string, T>) => void): void {
        this.onFlagsUpdatedCallback = callback;
    }

    destroy(): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
        this.socket = null;
        this.flags = {};
        this.context = null;
        this.isReady = false;
        this.onFlagsUpdatedCallback = undefined;
    }

    private sendContext(context: C) {
        const payload = JSON.stringify({ type: 'context', context });
        this.socket?.send(payload);
    }
}
