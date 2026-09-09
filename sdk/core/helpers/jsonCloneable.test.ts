import { ERR_CONTEXT_NOT_CLONEABLE, toJsonCloneable } from './jsonCloneable';

function vueLikeProxy<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      return Reflect.get(obj, prop, receiver);
    },
    set(obj, prop, value, receiver) {
      return Reflect.set(obj, prop, value, receiver);
    },
  });
}

describe('toJsonCloneable', () => {
  it('turns a Vue-like Proxy into a plain object that structuredClone accepts', () => {
    const proxy = vueLikeProxy({
      siteids: [1, 2],
      user: { key: 'weseedo' },
    });

    expect(() => structuredClone(proxy)).toThrow();

    const plain = toJsonCloneable(proxy);
    expect(plain).toEqual({ siteids: [1, 2], user: { key: 'weseedo' } });
    expect(plain).not.toBe(proxy);
    expect(() => structuredClone(plain)).not.toThrow();
  });

  it('drops Vue observer internals so circular __ob__ graphs serialize', () => {
    const context: Record<string, unknown> = { siteids: 789 };
    const observer = { value: context };
    context.__ob__ = observer;

    expect(toJsonCloneable(context)).toEqual({ siteids: 789 });
  });

  it('omits functions instead of failing', () => {
    expect(
      toJsonCloneable({
        user: { key: 'a', onClick: () => undefined },
        siteids: 1,
      })
    ).toEqual({ user: { key: 'a' }, siteids: 1 });
  });

  it('throws ERR_CONTEXT_NOT_CLONEABLE on circular references', () => {
    const circular: Record<string, unknown> = { key: 'a' };
    circular.self = circular;

    expect(() => toJsonCloneable(circular)).toThrow(
      /could not be converted to JSON/
    );
    try {
      toJsonCloneable(circular);
    } catch (err) {
      expect((err as { code?: string }).code).toBe(ERR_CONTEXT_NOT_CLONEABLE);
    }
  });
});
