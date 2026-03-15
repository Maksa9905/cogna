import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { DEFAULT_REDIS, RedisService } from '@liaoliaots/nestjs-redis'; // Должно быть здесь

export type TranscriptionMap = Record<number, string>;

@Injectable()
export class TranscriptionCacheService {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow(DEFAULT_REDIS);
  }

  public async saveChunksByAttempt(
    attemptId: string,
    chunkIndex: number,
    text: string,
  ) {
    const key = `transcription:attempt:${attemptId}`;
    await this.redis
      .pipeline()
      .hset(key, chunkIndex, text)
      .expire(key, 3600)
      .exec();
  }

  // public async getChunksByAttempt(attemptId: string) {
  //   const key = `transcription:attempt:${attemptId}`;
  //   const data = await this.redis.hgetall(key);
  //   const formattedData: TranscriptionMap = Object.entries(data)
  //     .map(([index, text]) => ({
  //       index: Number(index),
  //       text,
  //     }))
  //     .sort((a, b) => a.index - b.index);
  //   return formattedData;
  // }
}
