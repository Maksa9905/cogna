import { RedisService } from '../../infra/redis/redis.service';
import { Injectable } from '@nestjs/common';

export type RegisterCacheRequest = {
  email: string;
  password: string;
  otp: number;
};

export type RegisterCacheResponse = RegisterCacheRequest;

@Injectable()
export class AuthRegisterCache {
  constructor(private readonly redis: RedisService) {}

  public async save(data: RegisterCacheRequest) {
    const { email } = data;
    await this.redis.setex(`auth:register:${email}`, 600, JSON.stringify(data));
  }

  public async get(email: string) {
    const redisData = await this.redis.get(`auth:register:${email}`);
    if (!redisData) return null;
    return JSON.parse(redisData) as RegisterCacheResponse;
  }
}
