import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SentinelController } from './sentinel.controller';
import { SentinelService } from './sentinel.service';
@Module({ controllers: [SentinelController], providers: [PrismaService, SentinelService] })
export class SentinelModule {}
