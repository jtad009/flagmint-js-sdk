import { SseTransport } from './SSETransport';

class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  closed = false;
  onerror: ((ev?: unknown) => void) | null = null;
  private listeners = new Map<string, Set<(event: MessageEvent) => void>>();

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  static reset() {
    MockEventSource.instances = [];
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

function decodeContextFromUrl(url: string): Record<string, unknown> {
  const parsed = new URL(url);
  const encoded = parsed.searchParams.get('context');
  if (!encoded) throw new Error('missing context query param');
  return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
}

function createTransport(options: { apiKey?: string } = {}) {
  return new SseTransport<Record<string, any>, Record<string, unknown>>(
    'http://api.flagmint.test/evaluator/v2/flags',
    'sess-1',
    { user: { key: 'u1', name: 'Исроел' } },
    undefined,
    {
      apiKey: options.apiKey ?? 'ff_test',
      EventSourceImpl: MockEventSource,
      wrapper: { name: 'native-js', version: 'none' },
    }
  );
}

async function openStream(flags: Record<string, unknown> = { foo: true }) {
  const transport = createTransport();
  const initPromise = transport.init();
  const es = MockEventSource.instances[0];
  es.emit('connected', { connectionId: 'conn-1' });
  es.emit('flags', { flags });
  await initPromise;
  return { transport, es };
}

async function flush() {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
}

describe('SseTransport', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    MockEventSource.reset();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it('opens the stream with sessionId, utf8 context, and SDK telemetry', async () => {
    const { es, transport } = await openStream();
    const parsed = new URL(es.url);

    expect(parsed.pathname).toBe('/evaluator/v2/flags/stream');
    expect(parsed.searchParams.get('sessionId')).toBe('sess-1');
    expect(parsed.searchParams.get('sdkVersion')).toBe('2.0.0-test');
    expect(parsed.searchParams.get('platform')).toBe('nodejs');
    expect(parsed.searchParams.get('wrapperName')).toBe('native-js');
    expect(decodeContextFromUrl(es.url)).toMatchObject({
      user: { key: 'u1', name: 'Исроел' },
      custom: { source: 'SDK' },
    });

    transport.destroy();
  });

  it('rejects init when the connected event is not JSON', async () => {
    const transport = createTransport();
    const initPromise = transport.init();
    const es = MockEventSource.instances[0];

    es.emit('connected', 'not-json');

    await expect(initPromise).rejects.toThrow(/connectionId/);
    expect(es.closed).toBe(true);
    await expect(transport.fetchFlags({ user: { key: 'u2' } })).rejects.toThrow(
      /stream connection not active/
    );

    transport.destroy();
  });

  it('rejects init when the connected event is missing connectionId', async () => {
    const transport = createTransport();
    const initPromise = transport.init();
    const es = MockEventSource.instances[0];

    es.emit('connected', {});

    await expect(initPromise).rejects.toThrow(/connectionId/);
    expect(es.closed).toBe(true);
    await expect(transport.fetchFlags({ user: { key: 'u2' } })).rejects.toThrow(
      /stream connection not active/
    );

    transport.destroy();
  });

  it('reconnects if the stream drops after connected but before initial flags', async () => {
    jest.useFakeTimers();
    const transport = createTransport();
    const initPromise = transport.init();
    const es = MockEventSource.instances[0];
    es.emit('connected', { connectionId: 'conn-1' });

    es.onerror?.();

    expect(es.closed).toBe(true);
    await jest.advanceTimersByTimeAsync(2000);

    const es2 = MockEventSource.instances[1];
    expect(es2).toBeDefined();
    es2.emit('connected', { connectionId: 'conn-2' });
    es2.emit('flags', { flags: { foo: true } });

    await expect(initPromise).resolves.toBeUndefined();
    transport.destroy();
  });

  it('closes the stream when initial flags never arrive', async () => {
    jest.useFakeTimers();
    const transport = createTransport();
    const initPromise = transport.init();
    const es = MockEventSource.instances[0];
    es.emit('connected', { connectionId: 'conn-1' });
    await Promise.resolve();

    const timedOut = expect(initPromise).rejects.toThrow(/Timeout waiting for initial feature flags/);
    await jest.advanceTimersByTimeAsync(5000);
    await timedOut;
    expect(es.closed).toBe(true);

    es.onerror?.();
    await jest.advanceTimersByTimeAsync(2000);
    expect(MockEventSource.instances).toHaveLength(1);
    await expect(transport.fetchFlags({ user: { key: 'u2' } })).rejects.toThrow(
      /stream connection not active/
    );

    transport.destroy();
  });

  it('ignores a malformed flags packet instead of wiping the current snapshot', async () => {
    const { transport, es } = await openStream({ foo: true });
    const received: Array<Record<string, unknown>> = [];
    transport.onFlagsUpdated((flags) => received.push(flags));

    es.emit('flags', 'not-json');
    es.emit('flags', { connectionId: 'conn-1' });
    es.emit('flags', { flags: ['not', 'an', 'object'] });

    expect(received).toHaveLength(0);
    await expect(
      new Promise<Record<string, unknown>>((resolve) => {
        transport.onFlagsUpdated((flags) => resolve(flags));
        es.emit('flags', { flags: { foo: false } });
      })
    ).resolves.toEqual({ foo: false });

    transport.destroy();
  });

  it('forwards the analytics map from a flags packet', async () => {
    const { transport, es } = await openStream({ foo: true });
    const received: Array<Record<string, boolean>> = [];
    transport.onAnalyticsUpdated((analytics) => received.push(analytics));

    es.emit('flags', {
      flags: { foo: false },
      analytics: { foo: true, quiet_flag: false },
    });

    expect(received).toEqual([{ foo: true, quiet_flag: false }]);
    transport.destroy();
  });

  it('POSTs context with x-api-key and waits for flags on the stream, not the HTTP body', async () => {
    const { transport, es } = await openStream({ foo: true });
    const received: Array<Record<string, unknown>> = [];
    transport.onFlagsUpdated((flags) => received.push(flags as Record<string, unknown>));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 202,
      json: async () => ({ statusCode: 202, flags: { fromHttp: true } }),
    });

    const flagsPromise = transport.fetchFlags({ user: { key: 'u2' } });
    await flush();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [, request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(request.method).toBe('POST');
    expect(request.headers).toEqual({
      'Content-Type': 'application/json',
      'x-api-key': 'ff_test',
    });
    expect(JSON.parse(request.body)).toMatchObject({
      connectionId: 'conn-1',
      context: { user: { key: 'u2' } },
    });

    es.emit('flags', { flags: { fromStream: true } });
    await expect(flagsPromise).resolves.toEqual({ fromStream: true });
    expect(received.at(-1)).toEqual({ fromStream: true });

    transport.destroy();
  });

  it('serializes overlapping context updates instead of throwing', async () => {
    const { transport, es } = await openStream({ foo: true });
    let resolveFetch!: (value: unknown) => void;
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const first = transport.fetchFlags({ user: { key: 'first' } });
    const second = transport.fetchFlags({ user: { key: 'second' } });
    await flush();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const firstBody = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(firstBody.context.user.key).toBe('first');

    resolveFetch({
      ok: true,
      status: 202,
      json: async () => ({ statusCode: 202 }),
    });
    await flush();
    es.emit('flags', { flags: { n: 1 } });
    await first;
    await flush();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    const secondBody = JSON.parse((global.fetch as jest.Mock).mock.calls[1][1].body);
    expect(secondBody.context.user.key).toBe('second');

    resolveFetch({
      ok: true,
      status: 202,
      json: async () => ({ statusCode: 202 }),
    });
    await flush();
    es.emit('flags', { flags: { n: 2 } });
    await expect(second).resolves.toEqual({ n: 2 });

    transport.destroy();
  });

  it('applies cached flags from quota_exceeded and surfaces ERR_RATE_LIMITED', async () => {
    const transport = createTransport();
    const errors: Error[] = [];
    const flags: Array<Record<string, unknown>> = [];
    transport.onError((err) => errors.push(err));
    transport.onFlagsUpdated((next) => flags.push(next as Record<string, unknown>));

    const initPromise = transport.init();
    const es = MockEventSource.instances[0];
    es.emit('quota_exceeded', {
      statusCode: 429,
      message: 'Monthly evaluation limit reached for the "free" plan.',
      retryAfter: 60,
      upgradeUrl: '/settings/subscription',
      data: { cachedFlag: false },
    });

    await initPromise;
    expect(flags).toEqual([{ cachedFlag: false }]);
    expect((errors[0] as any).code).toBe('ERR_RATE_LIMITED');
    expect((errors[0] as any).retryAfter).toBe(60);

    await expect(transport.fetchFlags({ user: { key: 'u1' } })).rejects.toThrow(
      /stream connection not active/
    );

    transport.destroy();
  });

  it('rejects init on quota_exceeded when the server sends no cached flags', async () => {
    const transport = createTransport();
    const initPromise = transport.init();
    MockEventSource.instances[0].emit('quota_exceeded', {
      statusCode: 429,
      error: 'QUOTA_EXCEEDED',
      message: 'Monthly API call limit exceeded.',
      retryAfter: 3600,
    });

    await expect(initPromise).rejects.toMatchObject({ code: 'ERR_RATE_LIMITED' });
    transport.destroy();
  });

  it('rejects init on a named SSE error event', async () => {
    const transport = createTransport();
    const initPromise = transport.init();
    MockEventSource.instances[0].emit('error', { error: 'invalid_api_key' });

    await expect(initPromise).rejects.toMatchObject({ code: 'ERR_AUTH' });
    transport.destroy();
  });

  it('ignores malformed quota and named error packets instead of killing the stream', async () => {
    const { transport, es } = await openStream({ foo: true });
    const errors: Error[] = [];
    transport.onError((err) => errors.push(err));

    es.emit('quota_exceeded', 'not-json');
    es.emit('quota_exceeded', { connectionId: 'conn-1' });
    es.emit('error', 'not-json');
    es.emit('error', { message: 'missing error code' });

    expect(errors).toHaveLength(0);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 202,
      json: async () => ({ statusCode: 202 }),
    });
    const flagsPromise = transport.fetchFlags({ user: { key: 'u2' } });
    await flush();
    es.emit('flags', { flags: { foo: false } });
    await expect(flagsPromise).resolves.toEqual({ foo: false });

    transport.destroy();
  });

  it('maps HTTP 429 on context POST to ERR_RATE_LIMITED and applies cached flags', async () => {
    const { transport } = await openStream({ foo: true });
    const flags: Array<Record<string, unknown>> = [];
    transport.onFlagsUpdated((next) => flags.push(next as Record<string, unknown>));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        statusCode: 429,
        message: 'Monthly evaluation limit reached for the "free" plan.',
        retryAfter: 60,
        data: { cachedFlag: true },
      }),
    });

    await expect(transport.fetchFlags({ user: { key: 'u2' } })).rejects.toMatchObject({
      code: 'ERR_RATE_LIMITED',
    });
    expect(flags.at(-1)).toEqual({ cachedFlag: true });

    transport.destroy();
  });

  it('reconnects with the last sent context when persist is false', async () => {
    const { transport, es } = await openStream({ foo: true });

    (global.fetch as jest.Mock).mockImplementation(async () => {
      setImmediate(() => es.emit('flags', { flags: { transient: true } }));
      return {
        ok: true,
        status: 202,
        json: async () => ({ statusCode: 202 }),
      };
    });

    await transport.fetchFlags({ user: { key: 'transient' } }, { persist: false });

    jest.useFakeTimers();
    es.onerror?.();
    await jest.advanceTimersByTimeAsync(2000);

    const es2 = MockEventSource.instances.at(-1)!;
    expect(decodeContextFromUrl(es2.url)).toMatchObject({
      user: { key: 'transient' },
      custom: { source: 'SDK' },
    });

    jest.useRealTimers();
    transport.destroy();
  });

  it('reconnects after a dead connection (404) on context POST', async () => {
    const { transport } = await openStream({ foo: true });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ statusCode: 404 }),
    });

    await expect(transport.fetchFlags({ user: { key: 'u2' } })).rejects.toThrow(/not found or is dead/);
    transport.destroy();
  });

  it('aborts a hung context POST so a later update is not stuck behind it', async () => {
    const { transport, es } = await openStream({ foo: true });
    jest.useFakeTimers();

    let calls = 0;
    const bodies: Array<{ context?: { user?: { key?: string } } }> = [];
    (global.fetch as jest.Mock).mockImplementation(
      (_url: string, init: { signal?: AbortSignal; body?: string }) => {
        calls += 1;
        bodies.push(JSON.parse(String(init.body)));
        if (calls === 1) {
          return new Promise((_resolve, reject) => {
            const abort = () => {
              const err = new Error('The operation was aborted.');
              err.name = 'AbortError';
              reject(err);
            };
            if (init.signal?.aborted) {
              abort();
              return;
            }
            init.signal?.addEventListener('abort', abort);
          });
        }
        return Promise.resolve({
          ok: true,
          status: 202,
          json: async () => ({ statusCode: 202 }),
        });
      }
    );

    const hung = transport.fetchFlags({ user: { key: 'hung' } });
    const later = transport.fetchFlags({ user: { key: 'later' } });
    const hungAborted = expect(hung).rejects.toMatchObject({ name: 'AbortError' });
    await jest.advanceTimersByTimeAsync(5000);
    await hungAborted;

    await Promise.resolve();
    es.emit('flags', { flags: { later: true } });
    await expect(later).resolves.toEqual({ later: true });
    expect(bodies).toHaveLength(2);
    expect(bodies[0].context?.user?.key).toBe('hung');
    expect(bodies[1].context?.user?.key).toBe('later');

    transport.destroy();
  });

  it('config sync opens with fullConfig and applies lease + fullConfig', async () => {
    const applied: string[] = [];
    let flags: Record<string, unknown> = {};
    const transport = new SseTransport<Record<string, any>, unknown>(
      'http://api.flagmint.test/evaluator/v2/flags',
      'sess-cfg',
      { user: { key: 'u1' } },
      undefined,
      {
        apiKey: 'ff_test',
        EventSourceImpl: MockEventSource,
        configSync: true,
        contextAsTelemetry: true,
        getConfigSyncParams: () => ({ wantFullConfig: true }),
        onConfigSyncEvent: (eventName) => {
          applied.push(eventName);
          if (eventName === 'lease') return { publish: false };
          flags = { demo: true };
          return { publish: true };
        },
        getEvaluatedFlags: () => flags,
        getAnalyticsMap: () => ({ demo: true }),
      },
    );

    const analytics: Record<string, boolean>[] = [];
    transport.onAnalyticsUpdated((map) => analytics.push(map));

    const initPromise = transport.init();
    const es = MockEventSource.instances[0];
    const parsed = new URL(es.url);
    expect(parsed.searchParams.get('fullConfig')).toBe('true');
    expect(parsed.searchParams.get('sinceVersion')).toBeNull();

    es.emit('connected', { connectionId: 'conn-cfg' });
    es.emit('lease', { type: 'lease', version: 1, expiresAt: Date.now() + 60_000, signature: 'x' });
    es.emit('fullConfig', {
      type: 'fullConfig',
      version: 1,
      flags: [{ key: 'demo' }],
      signature: 'y',
    });
    await initPromise;

    expect(applied).toEqual(['lease', 'fullConfig']);
    await expect(
      transport.fetchFlags({ user: { key: 'u2' } }),
    ).resolves.toEqual({ demo: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.flagmint.test/evaluator/v2/flags/context',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(analytics.at(-1)).toEqual({ demo: true });

    transport.destroy();
  });

  it('config sync reconnect catch-up uses sinceVersion', async () => {
    const transport = new SseTransport<Record<string, any>, unknown>(
      'http://api.flagmint.test/evaluator/v2/flags',
      'sess-cfg',
      { user: { key: 'u1' } },
      undefined,
      {
        apiKey: 'ff_test',
        EventSourceImpl: MockEventSource,
        configSync: true,
        getConfigSyncParams: () => ({ wantFullConfig: false, sinceVersion: 9 }),
        onConfigSyncEvent: () => ({ publish: true }),
        getEvaluatedFlags: () => ({ demo: false }),
      },
    );

    const initPromise = transport.init();
    const es = MockEventSource.instances[0];
    expect(new URL(es.url).searchParams.get('fullConfig')).toBe('false');
    expect(new URL(es.url).searchParams.get('sinceVersion')).toBe('9');
    es.emit('connected', { connectionId: 'conn-cfg' });
    es.emit('lease', { type: 'lease', version: 9, signature: 'x' });
    await initPromise;
    transport.destroy();
  });
});
