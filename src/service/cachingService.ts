import cache from 'node-cache';

type CacheResult<T> = T | undefined;

class CacheClient {
    private readonly client = new cache();

    public getCache<T>(key: string): CacheResult<T> {
        console.log('get cache!');
        return this.client.get<T>(key);
    }

    public setCache<T>(key: string, value: T, ttl?: number) {
        this.client.set<T>(key, value, { ttl: ttl });
    }
}

export const cacheClient = new CacheClient();