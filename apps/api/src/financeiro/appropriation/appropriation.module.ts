import { Module } from '@nestjs/common';
import { AppropriationService } from './appropriation.service';
import { AppropriationController } from './appropriation.controller';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  controllers: [AppropriationController],
  providers: [AppropriationService, PrismaService],
  exports: [AppropriationService],
})
export class AppropriationModule {}
