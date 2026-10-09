import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';

@Module({
  controllers: [CrmController],
  providers: [PrismaService, CrmService],
  exports: [CrmService],
})
export class CrmModule {}
