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
import { IRekognition } from "@domain/interfaces/IRekognition";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Rekognition } from "@clients/rekognition/rekognition";
import { S3Service } from "@services/s3Service";

@Injectable()
export class RekognitionService implements IRekognition {

    constructor(private clientRekognition: Rekognition, private s3Service: S3Service, private configService: ConfigService) {
    }

    async getAwsCredentials(): Promise<any> {
        return this.clientRekognition.getAwsCredentials();
    }

    getSessionResult(sessionId: string): Promise<GetFaceLivenessSessionResultsCommandOutput> {
        return this.clientRekognition.getSessionResult(sessionId);
    }

    createLivenessSession(): Promise<CreateFaceLivenessSessionCommandOutput> {
        return this.clientRekognition.createLivenessSession();
    }
    async detectLabels(bucketName: string, imageKey: string): Promise<DetectLabelsCommandOutput> {
        return this.clientRekognition.detectLabels(bucketName, imageKey);
    }

    async detectText(bucketName: string, imageKey: string): Promise<DetectTextCommandOutput> {
        return this.clientRekognition.detectText(bucketName, imageKey);
    }

    async compareFaces(sourceBucket: string, sourceKey: string, targetBucket: string, targetKey: string): Promise<CompareFacesCommandOutput> {
        return this.clientRekognition.compareFaces(sourceBucket, sourceKey, targetBucket, targetKey);
    }
}
