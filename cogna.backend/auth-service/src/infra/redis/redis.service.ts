import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);

  constructor(configService: ConfigService) {
    const redisUrl =
      configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    super(redisUrl);
    this.logger.log(`Initializing Redis connection to ${redisUrl}`);

    this.on('error', (err) => {
      this.logger.error('Redis connection error', err);
    });
    this.on('connect', () => {
      this.logger.log('Redis client connected');
    });
  }

  async onModuleInit() {
    try {
      await this.ping();
      this.logger.log('Successfully connected to Redis');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.quit();
      this.logger.log('Disconnected from Redis');
    } catch (error) {
      this.logger.error('Error disconnecting from Redis', error);
    }
  }
}
