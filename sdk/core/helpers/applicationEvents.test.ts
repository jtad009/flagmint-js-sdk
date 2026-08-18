import {
  eventsUrlFromRestEndpoint,
  extraFromError,
  shouldReportApplicationEvent,
  userKeyFromContext,
} from './applicationEvents';

describe('applicationEvents helpers', () => {
  it('derives the events URL from the evaluate endpoint', () => {
    expect(eventsUrlFromRestEndpoint('https://api.flagmint.com/evaluator/evaluate')).toBe(
      'https://api.flagmint.com/evaluator/events'
    );
    expect(eventsUrlFromRestEndpoint('http://localhost:3000/evaluator/evaluate')).toBe(
      'http://localhost:3000/evaluator/events'
    );
  });

  it('reads the user key from nested context', () => {
    expect(userKeyFromContext({ user: { key: 'user-123' } })).toBe('user-123');
    expect(userKeyFromContext({ userKey: 'legacy' })).toBe('legacy');
    expect(userKeyFromContext({})).toBeUndefined();
  });

  it('captures error name and message without a stack', () => {
    const extra = extraFromError(new TypeError('boom'), { step: 'checkout' });
    expect(extra).toEqual({
      message: 'boom',
      name: 'TypeError',
      step: 'checkout',
    });
  });
});

describe('shouldReportApplicationEvent', () => {
  it('sends when the server has not yet provided an analytics map', () => {
    expect(shouldReportApplicationEvent(null, 'homepage_variant')).toBe(true);
  });

  it('sends only when analytics is on for that flag', () => {
    const analytics = { homepage_variant: true, quiet_flag: false };
    expect(shouldReportApplicationEvent(analytics, 'homepage_variant')).toBe(true);
    expect(shouldReportApplicationEvent(analytics, 'quiet_flag')).toBe(false);
    expect(shouldReportApplicationEvent(analytics, 'unknown_flag')).toBe(false);
  });

  it('skips empty flag keys', () => {
    expect(shouldReportApplicationEvent(null, '')).toBe(false);
  });
});
