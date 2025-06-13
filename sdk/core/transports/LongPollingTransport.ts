// core/transports/LongPollingTransport.ts
import type { Transport } from './Transport';

export class LongPollingTransport<C, T> implements Transport<C, T> {
    private isStopped = false;
    constructor(private endpoint: string, private apiKey: string, private context: C) { }

    async init(onUpdate: (flags: Record<string, T>) => void) {
        // No-op for polling
        // Start the long‐poll loop
        while (!this.isStopped) {
            try {
                const flags = await this.fetchFlags(this.context);
                onUpdate(flags);
            } catch (err) {
                console.error('[LongPollingTransport] poll error', err);
                // back off a bit before retrying
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    async fetchFlags(context: C): Promise<Record<string, T>> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'x-api-key': `${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ context }),
        });
        console.log(res, 'response')
        if (res.status === 401 || res.status === 403) {
            throw new Error('Unauthorized: Invalid API key');
        }

        if (!res.ok) {
            throw new Error(`Unexpected response: ${res.status}`);
        }
        const data =  await res.json();
        return data.data as Record<string, T>;
    }

    destroy() {
        this.isStopped = true;
    }
}
