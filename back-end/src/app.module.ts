import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RekognitionController } from '@controllers/rekognition/rekognition';
import { RekognitionService } from '@services/rekognitionService';
import { S3Service } from '@services/s3Service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'environments/.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController, RekognitionController],
  providers: [AppService, RekognitionService, S3Service],
})
export class AppModule { }
