import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@erp/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('🐘 PostgreSQL connected successfully via Prisma multi-schema client');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🐘 PostgreSQL disconnected');
  }
}
