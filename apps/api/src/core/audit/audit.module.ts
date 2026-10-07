import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

@Module({
  controllers: [AuditController],
  providers: [PrismaService, AuditService],
  exports: [AuditService],
})
export class AuditModule {}
