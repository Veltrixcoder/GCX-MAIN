export * from 'solid-js?original';

export function splitProps(props, ...keys) {
  const result = [];
  const allKeys = new Set(keys.flat());
  
  for (const group of keys) {
    const obj = {};
    for (const key of group) {
      Object.defineProperty(obj, key, {
        get() { return props[key]; },
        enumerable: true,
        configurable: true
      });
    }
    result.push(obj);
  }
  
  const rest = new Proxy(props, {
    get(target, key) {
      if (allKeys.has(key)) return undefined;
      return target[key];
    },
    has(target, key) {
      if (allKeys.has(key)) return false;
      return key in target;
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(k => !allKeys.has(k));
    },
    getOwnPropertyDescriptor(target, key) {
      if (allKeys.has(key)) return undefined;
      return Reflect.getOwnPropertyDescriptor(target, key);
    }
  });
  
  result.push(rest);
  return result;
}
