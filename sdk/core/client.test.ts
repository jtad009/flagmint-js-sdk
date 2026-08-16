import { FlagClient } from './client';
import type { Transport } from './transports/Transport';

function createMockTransport() {
  const fetchFlagsCalls: Array<Record<string, unknown>> = [];
  let flagsCallback: ((flags: Record<string, unknown>) => void) | undefined;

  const transport: Transport<Record<string, unknown>, unknown> & {
    fetchFlagsCalls: Array<Record<string, unknown>>;
  } = {
    fetchFlagsCalls,
    async init() {
      flagsCallback?.({ boot: true });
    },
    async fetchFlags(context) {
      fetchFlagsCalls.push(context);
      return { from: (context as { user?: unknown }).user };
    },
    destroy() {},
    onFlagsUpdated(callback) {
      flagsCallback = callback;
    },
  };

  return transport;
}

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe('FlagClient', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('passes each overlapping updateContext call its own merged context', async () => {
    const transport = createMockTransport();
    const client = new FlagClient({
      apiKey: 'ff_test',
      context: { user: 'base', custom: { source: 'SDK' } },
      enableFlagmint: true,
      deferInitialization: true,
      shareConnection: false,
      enableOfflineCache: false,
      persistContext: true,
      cacheAdapter: {
        loadFlags: () => null,
        saveFlags: () => undefined,
        loadContext: () => null,
        saveContext: async () => {
          await Promise.resolve();
        },
      },
      transport,
    });

    await client.ready(50);

    const first = client.updateContext({ user: 'first' });
    const second = client.updateContext({ user: 'second' });
    await Promise.all([first, second]);

    expect(transport.fetchFlagsCalls).toEqual([
      { user: 'first', custom: { source: 'SDK' } },
      { user: 'second', custom: { source: 'SDK' } },
    ]);

    client.destroy();
  });

  it('surfaces handshake 401 as ERR_AUTH on the error object', async () => {
    const errors: Error[] = [];
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(401, {}));

    const client = new FlagClient({
      apiKey: 'ff_test',
      enableFlagmint: true,
      deferInitialization: true,
      shareConnection: false,
      enableOfflineCache: false,
      transportMode: 'sse',
      EventSourceImpl: class {
        url: string;
        constructor(url: string) {
          this.url = url;
        }
        addEventListener() {}
        removeEventListener() {}
        close() {}
      },
      onError: (err) => errors.push(err),
    });

    await client.ready(50);
    expect((errors[0] as { code?: string }).code).toBe('ERR_AUTH');
    client.destroy();
  });

  it('posts the handshake to handshakeEndpoint when provided', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse(200, { data: { sessionId: 'sess-1' } })
    );

    const client = new FlagClient({
      apiKey: 'ff_test',
      enableFlagmint: true,
      deferInitialization: true,
      shareConnection: false,
      enableOfflineCache: false,
      transportMode: 'long-polling',
      handshakeEndpoint: 'https://gateway.example/auth/asl-handshake',
      restEndpoint: 'https://gateway.example/evaluator/evaluate',
    });

    await client.ready(20);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://gateway.example/auth/asl-handshake',
      expect.objectContaining({
        method: 'POST',
        headers: { 'X-API-Key': 'ff_test' },
      })
    );
    client.destroy();
  });

  it('does not overwrite cached flags when long-polling has no snapshot yet', async () => {
    const saveFlags = jest.fn();
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      if (String(input).includes('asl-handshake')) {
        return jsonResponse(200, { data: { sessionId: 'sess-1' } });
      }
      return new Promise(() => undefined);
    }) as unknown as typeof fetch;

    const client = new FlagClient({
      apiKey: 'ff_test',
      enableFlagmint: true,
      deferInitialization: true,
      shareConnection: false,
      transportMode: 'long-polling',
      enableOfflineCache: true,
      cacheAdapter: {
        loadFlags: () => ({ cached: true }),
        saveFlags,
        loadContext: () => null,
        saveContext: () => undefined,
      },
    });

    await client.ready(50);
    expect(client.getFlag('cached')).toBe(true);
    expect(saveFlags).not.toHaveBeenCalledWith('ff_test', {});
    client.destroy();
  });
});
