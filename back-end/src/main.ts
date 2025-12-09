import apm from 'elastic-apm-node';

apm.start({
  serviceName: 'kata-senior-backend',
  serverUrl: process.env.ELASTIC_APM_SERVER_URL || 'http://localhost:8200',
  environment: process.env.NODE_ENV || 'development',
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('KATA Senior API')
    .setDescription('The KATA Senior API description')
    .setVersion('1.0')
    .addTag('Rekognition')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Increase payload size limit for base64 images (50MB)
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalInterceptors(new LoggingInterceptor());

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins by reflecting the request origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, apiKey, channel, xname, uuid, document-number',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}
// Trigger restart
bootstrap();
