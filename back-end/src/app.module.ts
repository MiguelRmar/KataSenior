import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'; // Import tokens
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RekognitionController } from '@controllers/rekognition/rekognition';
import { RekognitionService } from '@services/rekognitionService';
import { S3Service } from '@services/s3Service';
import { HeadersGuard } from './infrastructure/guards/headers.guard';
import { ResponseInterceptor } from './infrastructure/interceptors/response.interceptor';
import { AllExceptionsFilter } from './infrastructure/filters/http-exception.filter';
import { AuthModule } from './infrastructure/modules/auth.module';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { EncryptionService } from './infrastructure/services/encryption.service';
import { Rekognition } from '@clients/rekognition/rekognition';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'environments/.env',
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController, RekognitionController],
  providers: [
    AppService,
    RekognitionService,
    S3Service,
    EncryptionService,
    Rekognition,
    {
      provide: APP_GUARD,
      useClass: HeadersGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
