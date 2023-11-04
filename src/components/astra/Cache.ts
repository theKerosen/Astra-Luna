import { AstraDebugger } from "./Debugger";

export class Cache {
  private debugger: AstraDebugger = new AstraDebugger(process.stdout);

  cache: {
    [key: string]: {
      value: unknown;
      expireDate?: number;
    };
  } = {};

  put(k: string, v: unknown, ttl?: number) {
    this.debug();

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
  }

  get(k: string) {
    const cacheExpire = this.cache[k].expireDate;
    const cacheValue = this.cache[k].value;

    this.debug();

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

  debug() {
    this.debugger.attach("CACHE", this.cache, 1);
  }
}
