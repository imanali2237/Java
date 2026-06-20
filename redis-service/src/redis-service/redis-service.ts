import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {

    private readonly redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: '127.0.0.1',
            port: 6379,
        });
    }


    async set(
        key: string,
        value: any,
        ttl = 3600,
    ) {
        await this.redis.set(
            key,
            JSON.stringify(value),
            'EX',
            ttl,
        );
    }


    async get<T>(key: string): Promise<T | null> {

        const data = await this.redis.get(key);

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    }


    async delete(key:string){
        await this.redis.del(key);
    }


    getClient() {
        return this.redis;
    }


    async onModuleDestroy() {
        await this.redis.quit();
    }
}