export function omit<T extends object, K extends keyof T>(target: T, ...omitKeys: K[]): Omit<T, K> {
  return (Object.keys(target) as K[]).reduce(
    (res, key) => {
      if (!omitKeys.includes(key)) {
        res[key] = target[key];
      }
      return res;
    },
    {} as any,
  );
}

//function to be used for filtering lists based on trie recommendations
export function filterObject(o: object, recommendations: string[], search: string): object {
  let filtered = {};
  if (recommendations.length) {
    Object.entries(o).forEach(kv => {
      const [key, value] = kv;
      if (recommendations.includes(key)) {
        filtered[key] = value;
      }
    });
  } else {
    //if inputbox is empty, show everything
    if (search.length === 0) {
      filtered = { ...o };
    } else {
      //else show nothing
      return {};
    }
  }
  return filtered;
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
    });
  });
}
