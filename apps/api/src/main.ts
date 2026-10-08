import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ProblemDetailsFilter } from './filters/problem-details.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const prefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(prefix);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global RFC 7807 error filter
  app.useGlobalFilters(new ProblemDetailsFilter());

  // OpenAPI Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('ERP Enterprise Platform v1.0')
    .setDescription('Modular Monolith Enterprise Resource Planning (ERP) REST API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Core - Auth', 'Authentication and session tokens')
    .addTag('Core - Tenants', 'Multi-tenant organization provisioning')
    .addTag('Core - Users', 'User management')
    .addTag('Core - Companies & Branches', 'Enterprise companies and branches')
    .addTag('Core - RBAC & Permissions', 'Roles and granular permissions')
    .addTag('Core - Audit Trail', 'Immutable audit logs')
    .addTag('Core - Workflows', 'Approval workflows and state engine')
    .addTag('Financeiro', 'Contas a pagar, receber, tesouraria e conciliação')
    .addTag('Contábil', 'Razão imutável, plano de contas e partidas dobradas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 ERP API is running at http://localhost:${port}/${prefix}`);
  logger.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
