import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  controllers: [WebhooksController],
  providers: [PrismaService, WebhooksService],
  exports: [WebhooksService],
})
export class IntegracoesModule {}
