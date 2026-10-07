import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { RbacGuard } from './guards/rbac.guard';

@Module({
  controllers: [PermissionsController],
  providers: [PrismaService, PermissionsService, RbacGuard],
  exports: [PermissionsService, RbacGuard],
})
export class PermissionsModule {}
