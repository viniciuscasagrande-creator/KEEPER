import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('WorkerBootstrap');
  const app = await NestFactory.create(WorkerModule);
  app.enableShutdownHooks();

  const port = process.env.PORT || 4001;
  await app.listen(port);
  logger.log(`⚙️ ERP Background Worker service is listening on port ${port}...`);
}

bootstrap();
