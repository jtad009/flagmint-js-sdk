import { LongPollingTransport } from './LongPollingTransport';

describe('LongPollingTransport', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('surfaces the server quota message on HTTP 429 instead of an empty statusText', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 429,
      statusText: '',
      json: async () => ({
        statusCode: 429,
        error: 'QUOTA_EXCEEDED',
        message: 'Monthly overage spend cap reached. Raise or remove the cap in Settings → Subscription to continue serving evaluations.',
        retryAfter: 3600,
        upgradeUrl: '/settings/subscription',
      }),
    }) as unknown as typeof fetch;

    const transport = new LongPollingTransport(
      'http://api.flagmint.test/evaluator/evaluate',
      'ff_test',
      { user: { key: 'u1' } },
      { pollIntervalMs: 60_000 },
    );

    await expect(transport.fetchFlags({ user: { key: 'u1' } })).rejects.toMatchObject({
      code: 'ERR_RATE_LIMITED',
      message: expect.stringMatching(/spend cap reached/i),
    });

    transport.destroy();
  });
});
