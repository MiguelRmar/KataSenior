import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RekognitionController } from '@controllers/rekognition/rekognition';
import { RekognitionService } from '@services/rekognitionService';


@Module({
  imports: [],
  controllers: [AppController, RekognitionController],
  providers: [AppService, RekognitionService],
})
export class AppModule { }
