/**
 * Convert a value into a structured-cloneable plain JSON tree.
 *
 * {@link BroadcastChannel.postMessage} uses the structured clone algorithm,
 * which cannot clone Vue 3 reactive Proxies, class instances with methods,
 * or DOM nodes. `JSON.stringify` *can* walk Vue proxies, so this is the
 * bridge used before posting share-hub messages and before storing context.
 *
 * Vue 2 observer internals (`__ob__`) are dropped so circular observer
 * graphs do not throw.
 */
const SKIP_KEYS = new Set([
  '__ob__',
  '__v_isRef',
  '__v_isReactive',
  '__v_isReadonly',
  '__v_raw',
  '__v_skip',
]);

export const ERR_CONTEXT_NOT_CLONEABLE = 'ERR_CONTEXT_NOT_CLONEABLE';

function cloneableReplacer(key: string, value: unknown): unknown {
  if (SKIP_KEYS.has(key)) return undefined;
  if (typeof value === 'function' || typeof value === 'symbol') return undefined;
  return value;
}

export function toJsonCloneable<T>(value: T): T {
  try {
    const json = JSON.stringify(value, cloneableReplacer);
    if (json === undefined) {
      throw new Error('Value serialized to undefined');
    }
    return JSON.parse(json) as T;
  } catch (err) {
    throw Object.assign(
      new Error(
        'Evaluation context or flags could not be converted to JSON. Pass a plain JSON object (Vue reactive proxies are supported; functions, DOM nodes, and circular references are not).'
      ),
      {
        code: ERR_CONTEXT_NOT_CLONEABLE,
        cause: err instanceof Error ? err : new Error(String(err)),
      }
    );
  }
}
