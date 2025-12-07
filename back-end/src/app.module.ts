import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RekognitionController } from './infrastructure/controllers/rekognition/rekognition';



@Module({
  imports: [],
  controllers: [AppController, RekognitionController],
  providers: [AppService],
})
export class AppModule { }
