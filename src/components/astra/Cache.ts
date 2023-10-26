export class Cache {
  cache: {
    [key: string]: {
      value: unknown;
      expireDate: number;
    };
  } = {};

  put(k: string, v: unknown, ttl: number) {
    const expireDate = Date.now() + ttl * 1000;
    this.cache[k] = {
      value: v,
      expireDate: expireDate,
    };

    return true;
  }

  get(k: string) {
    if (this.cache[k]?.expireDate && this.cache[k].expireDate > Date.now()) {
      return this.cache[k].value;
    }
    delete this.cache[k];
    return undefined;
  }

  getTTL(k: string) {
    return Math.max(this.cache[k]?.expireDate - Date.now(), 0);
  }
}
