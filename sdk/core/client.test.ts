import { FlagClient } from './client';
import type { Transport } from './transports/Transport';

function createMockTransport() {
  const fetchFlagsCalls: Array<{
    context: Record<string, unknown>;
    options?: { persist?: boolean };
  }> = [];
  let flagsCallback: ((flags: Record<string, unknown>) => void) | undefined;
  let analyticsCallback: ((analytics: Record<string, boolean>) => void) | undefined;

  const transport: Transport<Record<string, unknown>, unknown> & {
    fetchFlagsCalls: Array<{
      context: Record<string, unknown>;
      options?: { persist?: boolean };
    }>;
    emitAnalytics: (analytics: Record<string, boolean>) => void;
  } = {
    fetchFlagsCalls,
    async init() {
      flagsCallback?.({ boot: true });
    },
    async fetchFlags(context, options) {
      fetchFlagsCalls.push({ context, options });
      return { from: (context as { user?: unknown }).user };
    },
    destroy() {},
    onFlagsUpdated(callback) {
      flagsCallback = callback;
    },
    onAnalyticsUpdated(callback) {
      analyticsCallback = callback;
    },
    emitAnalytics(analytics) {
      analyticsCallback?.(analytics);
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

class MemoryChannel {
  static buses = new Map<string, Set<MemoryChannel>>();
  onmessage: ((event: { data: unknown }) => void) | null = null;

  constructor(public name: string) {
    if (!MemoryChannel.buses.has(name)) {
      MemoryChannel.buses.set(name, new Set());
    }
    MemoryChannel.buses.get(name)!.add(this);
  }

  static reset() {
    MemoryChannel.buses.clear();
  }

  postMessage(data: unknown) {
    const cloned = structuredClone(data);
    for (const channel of MemoryChannel.buses.get(this.name) ?? []) {
      if (channel !== this) {
        channel.onmessage?.({ data: cloned });
      }
    }
  }

  close() {
    MemoryChannel.buses.get(this.name)?.delete(this);
  }
}

class AutoMockEventSource {
  static instances: AutoMockEventSource[] = [];
  url: string;
  closed = false;
  onerror: ((ev?: unknown) => void) | null = null;
  private listeners = new Map<string, Set<(event: MessageEvent) => void>>();

  constructor(url: string) {
    this.url = url;
    AutoMockEventSource.instances.push(this);
    setImmediate(() => {
      if (this.closed) return;
      this.emit('connected', { connectionId: 'conn-1' });
      this.emit('flags', { flags: { boot: true } });
    });
  }

  static reset() {
    AutoMockEventSource.instances.forEach((instance) => instance.close());
    AutoMockEventSource.instances = [];
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: (event: MessageEvent) => void) {
    this.listeners.get(type)?.delete(listener);
  }

  close() {
    this.closed = true;
  }

  emit(type: string, data: unknown) {
    const event = {
      data: typeof data === 'string' ? data : JSON.stringify(data),
    } as MessageEvent;
    this.listeners.get(type)?.forEach((listener) => listener(event));
  }
}

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

function shareHooks() {
  const timers: Array<{ id: number; handler: () => void }> = [];
  let nextId = 1;
  return {
    storage: memoryStorage(),
    now: () => 1_000,
    channelFactory: (name: string) => new MemoryChannel(name),
    setTimer: (handler: () => void) => {
      const id = nextId++;
      timers.push({ id, handler });
      return id as unknown as ReturnType<typeof setInterval>;
    },
    clearTimer: (id: ReturnType<typeof setInterval>) => {
      const index = timers.findIndex((timer) => timer.id === (id as unknown as number));
      if (index >= 0) timers.splice(index, 1);
    },
    delay: async () => undefined,
  };
}

function clientInternals(client: FlagClient<any, any>) {
  return client as unknown as {
    transport: {
      context: Record<string, unknown>;
      fetchFlags: (
        context: Record<string, unknown>,
        options?: { persist?: boolean }
      ) => Promise<Record<string, unknown>>;
    };
    shareHub: { currentRole: 'leader' | 'follower' };
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
      {
        context: { user: 'first', custom: { source: 'SDK' } },
        options: { persist: true },
      },
      {
        context: { user: 'second', custom: { source: 'SDK' } },
        options: { persist: true },
      },
    ]);

    client.destroy();
  });

  it('ignores stale fetchFlags results when a newer updateContext finishes first', async () => {
    const fetchFlagsCalls: Array<{ context: Record<string, unknown> }> = [];
    const pendingResolvers: Array<(flags: Record<string, unknown>) => void> = [];
    const transport: Transport<Record<string, unknown>, unknown> = {
      async init() {},
      async fetchFlags(context) {
        fetchFlagsCalls.push({ context });
        return new Promise((resolve) => {
          pendingResolvers.push(resolve);
        });
      },
      destroy() {},
      onFlagsUpdated() {},
      onAnalyticsUpdated() {},
    };

    const client = new FlagClient({
      apiKey: 'ff_test',
      context: { user: 'base', custom: { source: 'SDK' } },
      enableFlagmint: true,
      deferInitialization: true,
      shareConnection: false,
      enableOfflineCache: false,
      transport,
    });

    await client.ready(50);

    const first = client.updateContext({ user: 'first' });
    const second = client.updateContext({ user: 'second' });

    pendingResolvers[1]({ from: 'second' });
    await second;
    pendingResolvers[0]({ from: 'first' });
    await first;

    expect(client.getFlags()).toEqual({ from: 'second' });
    expect(fetchFlagsCalls).toHaveLength(2);

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

  it('keeps persist true on a local transport when persistContext is false', async () => {
    const transport = createMockTransport();
    const client = new FlagClient({
      apiKey: 'ff_test',
      context: { user: { key: 'local' } },
      enableFlagmint: true,
      deferInitialization: true,
      shareConnection: false,
      enableOfflineCache: false,
      persistContext: false,
      transport,
    });

    await client.ready(50);
    await client.updateContext({ user: { key: 'after-login' } });

    expect(transport.fetchFlagsCalls).toEqual([
      {
        context: { user: { key: 'after-login' } },
        options: { persist: true },
      },
    ]);

    client.destroy();
  });

  describe('shared leader and follower persistContext', () => {
    beforeEach(() => {
      MemoryChannel.reset();
      AutoMockEventSource.reset();
    });

    afterEach(() => {
      AutoMockEventSource.reset();
      MemoryChannel.reset();
    });

    it.each([true, false])(
      'forwards persistContext %s from a follower updateContext onto the leader stream',
      async (persistContext) => {
        const persistCalls: Array<boolean | undefined> = [];
        global.fetch = jest.fn(async (input: RequestInfo | URL) => {
          const url = String(input);
          if (url.includes('asl-handshake')) {
            return jsonResponse(200, { data: { sessionId: 'sess-1' } });
          }
          if (url.includes('/context')) {
            setImmediate(() => {
              const es = AutoMockEventSource.instances.at(-1);
              es?.emit('flags', { flags: { afterContext: true } });
            });
            return jsonResponse(202, { statusCode: 202 });
          }
          return jsonResponse(500, {});
        }) as unknown as typeof fetch;

        const share = shareHooks();
        const apiKey = `ff_share_persist_${persistContext}`;
        const noCache = {
          loadFlags: () => null,
          saveFlags: () => undefined,
          loadContext: () => null,
          saveContext: () => undefined,
        };

        const leader = new FlagClient({
          apiKey,
          context: { user: { key: 'leader' } },
          enableFlagmint: true,
          deferInitialization: true,
          shareConnection: true,
          share,
          persistContext: false,
          enableOfflineCache: false,
          cacheAdapter: noCache,
          transportMode: 'sse',
          EventSourceImpl: AutoMockEventSource,
        });
        await leader.ready();

        const leaderTransport = clientInternals(leader).transport;
        const originalFetchFlags = leaderTransport.fetchFlags.bind(leaderTransport);
        leaderTransport.fetchFlags = async (context, options) => {
          persistCalls.push(options?.persist);
          return originalFetchFlags(context, options);
        };

        expect(clientInternals(leader).shareHub.currentRole).toBe('leader');
        expect(leaderTransport.context).toMatchObject({ user: { key: 'leader' } });

        const follower = new FlagClient({
          apiKey,
          context: { user: { key: 'follower-boot' } },
          enableFlagmint: true,
          deferInitialization: true,
          shareConnection: true,
          share,
          persistContext,
          enableOfflineCache: false,
          cacheAdapter: noCache,
          transportMode: 'sse',
          EventSourceImpl: AutoMockEventSource,
        });
        await follower.ready();

        expect(clientInternals(follower).shareHub.currentRole).toBe('follower');

        await follower.updateContext({ user: { key: 'from-follower' } });

        expect(persistCalls).toEqual([persistContext]);
        expect(JSON.parse((global.fetch as jest.Mock).mock.calls.at(-1)[1].body)).toMatchObject({
          connectionId: 'conn-1',
          context: { user: { key: 'from-follower' } },
        });
        expect(leaderTransport.context).toMatchObject({
          user: { key: persistContext ? 'from-follower' : 'leader' },
        });

        follower.destroy();
        leader.destroy();
      }
    );

    it('JSON-clones a Vue-like Proxy context from a follower updateContext', async () => {
      const persistCalls: Array<Record<string, unknown>> = [];
      global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes('asl-handshake')) {
          return jsonResponse(200, { data: { sessionId: 'sess-1' } });
        }
        if (url.includes('/context')) {
          persistCalls.push(JSON.parse(String(init?.body)));
          setImmediate(() => {
            const es = AutoMockEventSource.instances.at(-1);
            es?.emit('flags', { flags: { afterContext: true } });
          });
          return jsonResponse(202, { statusCode: 202 });
        }
        return jsonResponse(500, {});
      }) as unknown as typeof fetch;

      const share = shareHooks();
      const apiKey = 'ff_share_proxy_context';
      const noCache = {
        loadFlags: () => null,
        saveFlags: () => undefined,
        loadContext: () => null,
        saveContext: () => undefined,
      };

      const leader = new FlagClient({
        apiKey,
        context: { user: { key: 'leader' } },
        enableFlagmint: true,
        deferInitialization: true,
        shareConnection: true,
        share,
        persistContext: false,
        enableOfflineCache: false,
        cacheAdapter: noCache,
        transportMode: 'sse',
        EventSourceImpl: AutoMockEventSource,
      });
      await leader.ready();

      const follower = new FlagClient({
        apiKey,
        context: { user: { key: 'follower-boot' } },
        enableFlagmint: true,
        deferInitialization: true,
        shareConnection: true,
        share,
        persistContext: false,
        enableOfflineCache: false,
        cacheAdapter: noCache,
        transportMode: 'sse',
        EventSourceImpl: AutoMockEventSource,
      });
      await follower.ready();
      expect(clientInternals(follower).shareHub.currentRole).toBe('follower');

      const reactiveContext = new Proxy(
        { user: { key: 'from-follower' }, siteids: 42 },
        {
          get(obj, prop, receiver) {
            return Reflect.get(obj, prop, receiver);
          },
        }
      );

      await follower.updateContext(reactiveContext);

      expect(persistCalls.at(-1)).toMatchObject({
        connectionId: 'conn-1',
        context: { user: { key: 'from-follower' }, siteids: 42 },
      });

      follower.destroy();
      leader.destroy();
    });
  });

  describe('trackError', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('batches application errors onto POST /evaluator/events', async () => {
      global.fetch = jest.fn().mockResolvedValue(jsonResponse(202, { statusCode: 202 }));
      const transport = createMockTransport();
      const client = new FlagClient({
        apiKey: 'ff_test',
        context: { user: { key: 'user-123' } },
        enableFlagmint: true,
        deferInitialization: true,
        shareConnection: false,
        enableOfflineCache: true,
        persistContext: false,
        transport,
        restEndpoint: 'http://localhost:3000/evaluator/evaluate',
        cacheAdapter: {
          loadFlags: () => ({ checkout_redesign: true }),
          saveFlags: () => undefined,
          loadContext: () => null,
          saveContext: () => undefined,
        },
      });
      await client.ready();

      client.trackError('boot', new Error('payment failed'), { step: 'pay' });
      expect(global.fetch).not.toHaveBeenCalled();

      await jest.advanceTimersByTimeAsync(2000);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toBe('http://localhost:3000/evaluator/events');
      expect(init.method).toBe('POST');
      expect(init.headers['X-API-Key']).toBe('ff_test');
      expect(JSON.parse(init.body)).toMatchObject({
        events: [
          {
            flagKey: 'boot',
            kind: 'error',
            variationValue: true,
            userKey: 'user-123',
            extra: { message: 'payment failed', name: 'Error', step: 'pay' },
          },
        ],
      });
      client.destroy();
    });

    it('does not send events in preview mode', async () => {
      global.fetch = jest.fn();
      const client = new FlagClient({
        apiKey: 'ff_test',
        enableFlagmint: true,
        previewMode: true,
        rawFlags: {
          checkout_redesign: { key: 'checkout_redesign', value: true, type: 'boolean' } as any,
        },
        shareConnection: false,
      });

      client.trackError('checkout_redesign', new Error('boom'));
      await jest.advanceTimersByTimeAsync(2000);
      expect(global.fetch).not.toHaveBeenCalled();
      client.destroy();
    });

    it('does not send events when analytics is off for that flag', async () => {
      global.fetch = jest.fn().mockResolvedValue(jsonResponse(202, { statusCode: 202 }));
      const transport = createMockTransport();
      const client = new FlagClient({
        apiKey: 'ff_test',
        context: { user: { key: 'user-123' } },
        enableFlagmint: true,
        deferInitialization: true,
        shareConnection: false,
        enableOfflineCache: true,
        persistContext: false,
        transport,
        restEndpoint: 'http://localhost:3000/evaluator/evaluate',
        cacheAdapter: {
          loadFlags: () => ({ boot: true, quiet_flag: true }),
          saveFlags: () => undefined,
          loadContext: () => null,
          saveContext: () => undefined,
        },
      });
      await client.ready();
      transport.emitAnalytics({ boot: true, quiet_flag: false });

      client.trackError('quiet_flag', new Error('ignored'));
      await jest.advanceTimersByTimeAsync(2000);
      expect(global.fetch).not.toHaveBeenCalled();

      client.trackError('boot', new Error('counted'));
      await jest.advanceTimersByTimeAsync(2000);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)).toMatchObject({
        events: [{ flagKey: 'boot', kind: 'error' }],
      });
      client.destroy();
    });
  });
});
