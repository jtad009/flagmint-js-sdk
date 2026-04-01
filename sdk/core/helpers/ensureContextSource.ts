export function ensureContextSource<C>(context: C): C {
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return context;
  }

  const contextRecord = context as unknown as Record<string, unknown>;
  const sourceFromFlat = contextRecord['custom.source'];
  const custom = contextRecord.custom;
  const sourceFromCustom =
    custom && typeof custom === 'object' && !Array.isArray(custom)
      ? (custom as Record<string, unknown>).source
      : undefined;

  const source =
    typeof sourceFromFlat === 'string'
      ? sourceFromFlat
      : typeof sourceFromCustom === 'string'
        ? sourceFromCustom
        : 'API';

  return {
    ...contextRecord,
    custom:
      custom && typeof custom === 'object' && !Array.isArray(custom)
        ? {
          ...(custom as Record<string, unknown>),
          source,
        }
        : { source },
  } as C;
}