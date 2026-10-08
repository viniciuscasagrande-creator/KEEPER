import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { FiscalController } from './fiscal.controller';
import { FiscalService } from './fiscal.service';

@Module({
  controllers: [FiscalController],
  providers: [PrismaService, FiscalService],
  exports: [FiscalService],
})
export class FiscalModule {}
