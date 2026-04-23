import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useFactory: (config: ConfigService) => {
        return new RedisPubSub({
          publisher: new Redis(config.getOrThrow<string>('REDIS_URL')),
          subscriber: new Redis(config.getOrThrow<string>('REDIS_URL')),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PUB_SUB'],
})
export class PubSubModule {}
