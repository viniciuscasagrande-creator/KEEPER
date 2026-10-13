import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { FinanceiroModule } from '../financeiro/financeiro.module';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports: [FinanceiroModule],
  controllers: [ProducerController],
  providers: [PrismaService, ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
