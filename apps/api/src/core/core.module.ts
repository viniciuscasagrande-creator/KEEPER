import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuditModule } from './audit/audit.module';
import { WorkflowModule } from './workflow/workflow.module';

@Module({
  imports: [
    AuthModule,
    TenantsModule,
    UsersModule,
    CompaniesModule,
    PermissionsModule,
    AuditModule,
    WorkflowModule,
  ],
  exports: [
    AuthModule,
    TenantsModule,
    UsersModule,
    CompaniesModule,
    PermissionsModule,
    AuditModule,
    WorkflowModule,
  ],
})
export class CoreModule {}
