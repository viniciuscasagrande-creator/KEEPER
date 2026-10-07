import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ContabilController } from './contabil.controller';

@Module({
  controllers: [ContabilController],
  providers: [PrismaService],
  exports: [],
})
export class ContabilModule {}
