/**
 * Flatten evaluation context — port of FF-EU `utils/context-flatten.ts`
 * (without observed-context hashing helpers).
 *
 * `addKindLabel=false` (default): bare keys + `custom.*` (legacy / collision-prone for multi).
 * `addKindLabel=true`: `user.key`, `organization.plan`, … — matches FF-EU evaluate/SSE.
 */

export function flattenCustom(custom: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(custom)) {
    out[`custom.${k}`] = v;
  }
  return out;
}

function prefixKind(
  kind: string,
  obj: Record<string, any>,
  addKindLabel = false,
): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'kind') continue;
    if (k === 'custom' && typeof v === 'object' && v !== null && !Array.isArray(v)) {
      Object.assign(out, flattenCustom(v as Record<string, unknown>));
      continue;
    }
    if (addKindLabel) {
      out[`${kind}.${k}`] = v;
    } else {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Flatten a structured EvaluationContext (`kind` present).
 * Returns `{}` if `kind` is missing (callers should pass SSE-flat maps through).
 */
export function flattenContext(
  ctx: Record<string, any>,
  addKindLabel = false,
): Record<string, any> {
  if (!ctx || typeof ctx !== 'object' || !('kind' in ctx)) {
    return {};
  }
  if (ctx.kind === 'multi') {
    return {
      ...(ctx.user ? prefixKind('user', ctx.user, addKindLabel) : {}),
      ...(ctx.organization
        ? prefixKind('organization', ctx.organization, addKindLabel)
        : {}),
    };
  }
  return prefixKind(String(ctx.kind), ctx, addKindLabel);
}

/**
 * SDK convenience: structured contexts flatten; already-flat maps pass through.
 * Also supports nested `{ user, organization, custom }` without top-level `kind`
 * (common SDK shape) by synthesizing kind-prefixed keys for targeting.
 */
export function flattenEvaluationContext(
  context: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!context || typeof context !== 'object') return {};

  const kind = (context as { kind?: unknown }).kind;
  if (kind === 'user' || kind === 'organization' || kind === 'multi') {
    // Match FF-EU evaluator controller/service (kind-prefixed; safe for multi).
    return flattenContext(context as Record<string, any>, true);
  }

  // Already-flat SSE map (has user.key / custom.* and no structured kind)
  if (
    Object.keys(context).some(
      (k) => k.startsWith('user.') || k.startsWith('organization.') || k.startsWith('custom.'),
    )
  ) {
    return context;
  }

  // Nested SDK shape without kind
  const out: Record<string, unknown> = {};
  if (context.user && typeof context.user === 'object') {
    Object.assign(out, prefixKind('user', context.user as Record<string, any>, true));
  }
  if (context.organization && typeof context.organization === 'object') {
    Object.assign(
      out,
      prefixKind('organization', context.organization as Record<string, any>, true),
    );
  }
  if (context.custom && typeof context.custom === 'object') {
    Object.assign(out, flattenCustom(context.custom as Record<string, unknown>));
  }
  for (const [key, value] of Object.entries(context)) {
    if (key === 'user' || key === 'organization' || key === 'custom' || key === 'kind') {
      continue;
    }
    if (value !== null && typeof value === 'object') continue;
    out[key] = value;
  }
  return out;
}
