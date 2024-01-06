export class Cache {
  cache: {
    [key: string]: {
      value: unknown;
      expireDate?: number;
    };
  } = {};

  put(k: string, v: unknown, ttl?: number) {
    if (!ttl) {
      this.cache[k] = {
        value: v,
        expireDate: undefined,
      };
      return;
    }

    this.cache[k] = {
      value: v,
      expireDate: Date.now() + ttl * 1000,
    };
    return this;
  }

  get(k: string) {
    const cacheExpire = this.cache[k].expireDate;
    const cacheValue = this.cache[k].value;

    if (!cacheExpire) return this.cache[k]?.value;

    if (Date.now() > cacheExpire) delete this.cache[k];

    if (cacheValue) return this.cache[k].value;

    return undefined;
  }

  getTTL(k: string) {
    const cacheExpire = this.cache[k].expireDate;
    if (!cacheExpire) return undefined;

    return Math.max(cacheExpire - Date.now(), 0);
  }
}
