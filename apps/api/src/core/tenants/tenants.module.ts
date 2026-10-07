import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';

@Module({
  controllers: [TenantsController],
  providers: [PrismaService, TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
