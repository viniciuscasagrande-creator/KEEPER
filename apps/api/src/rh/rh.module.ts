import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RhController } from './rh.controller';
import { RhService } from './rh.service';

@Module({
  controllers: [RhController],
  providers: [PrismaService, RhService],
  exports: [RhService],
})
export class RhModule {}
