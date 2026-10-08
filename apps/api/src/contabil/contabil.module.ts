import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ContabilController } from './contabil.controller';
import { ContabilService } from './contabil.service';

@Module({
  controllers: [ContabilController],
  providers: [PrismaService, ContabilService],
  exports: [ContabilService],
})
export class ContabilModule {}
