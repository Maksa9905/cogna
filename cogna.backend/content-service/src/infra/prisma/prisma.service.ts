import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../../prisma/generated/client';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const pool = new Pool({
      connectionString: configService.getOrThrow<string>('DATABASE_URL'),
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  public async onModuleInit() {
    this.logger.log('🚀 Initializing database connection...');
    try {
      await this.$connect();
      this.logger.log('✅ Database connection established successfully');
    } catch (error) {
      this.logger.error('❌ Failed to establish database connection: ', error);
      throw error;
    }
  }

  public async onModuleDestroy() {
    this.logger.log('🛑 Closing database connection...');
    try {
      await this.$disconnect();
      this.logger.log('✅ Database connection closed successfully');
    } catch (error) {
      this.logger.error('❌ Failed to close database connection: ', error);
      throw error;
    }
  }
}
