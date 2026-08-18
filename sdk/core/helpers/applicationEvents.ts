export const MAX_EVENT_BATCH = 20;
export const EVENT_FLUSH_MS = 2000;

export type ApplicationEventKind = 'error' | 'custom';

export interface ApplicationEvent {
  flagKey: string;
  kind: ApplicationEventKind;
  eventName?: string;
  variationValue?: unknown;
  userKey?: string;
  timestamp: string;
  extra?: Record<string, unknown>;
}

export function eventsUrlFromRestEndpoint(restEndpoint: string): string {
  try {
    const url = new URL(restEndpoint);
    if (url.pathname.endsWith('/evaluate')) {
      url.pathname = url.pathname.replace(/\/evaluate\/?$/, '/events');
      return url.toString();
    }
    const trimmed = url.pathname.replace(/\/$/, '');
    url.pathname = `${trimmed}/events`;
    return url.toString();
  } catch {
    if (restEndpoint.endsWith('/evaluate')) {
      return restEndpoint.replace(/\/evaluate\/?$/, '/events');
    }
    return `${restEndpoint.replace(/\/$/, '')}/events`;
  }
}

export function userKeyFromContext(context: Record<string, unknown> | undefined): string | undefined {
  if (!context || typeof context !== 'object') return undefined;
  const user = context.user;
  if (user && typeof user === 'object' && !Array.isArray(user)) {
    const key = (user as Record<string, unknown>).key;
    if (typeof key === 'string' && key.length > 0) return key;
  }
  if (typeof context.userKey === 'string' && context.userKey.length > 0) {
    return context.userKey;
  }
  if (typeof context.key === 'string' && context.key.length > 0) {
    return context.key;
  }
  return undefined;
}

export function extraFromError(
  error: unknown,
  extra?: Record<string, unknown>
): Record<string, unknown> | undefined {
  const payload: Record<string, unknown> = { ...(extra ?? {}) };
  if (error instanceof Error) {
    payload.message = error.message.slice(0, 500);
    payload.name = error.name;
  } else if (typeof error === 'string' && error.length > 0) {
    payload.message = error.slice(0, 500);
  }
  return Object.keys(payload).length > 0 ? payload : undefined;
}

/**
 * When the server has sent an analytics map, only flags with analytics on
 * are reported. A null map means an older server — send and let ingest drop.
 */
export function shouldReportApplicationEvent(
  analyticsByFlag: Record<string, boolean> | null,
  flagKey: string
): boolean {
  if (!flagKey) return false;
  if (analyticsByFlag === null) return true;
  return analyticsByFlag[flagKey] === true;
}
