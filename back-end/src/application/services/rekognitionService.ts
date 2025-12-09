import {
    RekognitionClient,
    CreateFaceLivenessSessionCommand,
    CreateFaceLivenessSessionCommandOutput,
    GetFaceLivenessSessionResultsCommand,
    GetFaceLivenessSessionResultsCommandOutput,
    DetectLabelsCommand,
    DetectLabelsCommandOutput,
    CompareFacesCommand,
    CompareFacesCommandOutput,
    DetectTextCommand,
    DetectTextCommandOutput
} from "@aws-sdk/client-rekognition";
import { IRekognition, IContext } from "@domain/interfaces/IRekognition";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Rekognition } from "@clients/rekognition/rekognition";
import { S3Service } from "@services/s3Service";

@Injectable()
export class RekognitionService implements IRekognition {

    constructor(private clientRekognition: Rekognition, private s3Service: S3Service, private configService: ConfigService) {
    }

    async getAwsCredentials(context?: IContext): Promise<any> {
        return this.clientRekognition.getAwsCredentials(context);
    }

    getSessionResult(sessionId: string, context?: IContext): Promise<GetFaceLivenessSessionResultsCommandOutput> {
        return this.clientRekognition.getSessionResult(sessionId, context);
    }

    createLivenessSession(context?: IContext): Promise<CreateFaceLivenessSessionCommandOutput> {
        return this.clientRekognition.createLivenessSession(context);
    }
    async detectLabels(bucketName: string, imageKey: string, context?: IContext): Promise<DetectLabelsCommandOutput> {
        return this.clientRekognition.detectLabels(bucketName, imageKey, context);
    }

    async detectText(bucketName: string, imageKey: string, context?: IContext): Promise<DetectTextCommandOutput> {
        return this.clientRekognition.detectText(bucketName, imageKey, context);
    }

    async compareFaces(sourceBucket: string, sourceKey: string, targetBucket: string, targetKey: string, context?: IContext): Promise<CompareFacesCommandOutput> {
        return this.clientRekognition.compareFaces(sourceBucket, sourceKey, targetBucket, targetKey, context);
    }
}
