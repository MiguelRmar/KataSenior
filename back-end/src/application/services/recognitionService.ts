import { RekognitionClient, CreateFaceLivenessSessionCommand, CreateFaceLivenessSessionCommandOutput } from "@aws-sdk/client-rekognition";
import { IRekognition } from "@domain/interfaces/IRekognition";
import { Injectable } from "@nestjs/common";
import { rekognitionClient } from "@clients/rekognition/rekognition.client";

@Injectable()
export class RekognitionService implements IRekognition {
    private client: RekognitionClient;

    constructor() {
        this.client = rekognitionClient;
    }

    async createLivenessSession(): Promise<CreateFaceLivenessSessionCommandOutput> {
        const params = {
            Settings: {
                OutputConfig: {
                    S3Bucket: process.env.AWS_BUCKET_NAME || "appsmartechbucket",
                    S3KeyPrefix: 'liveness-sessions/',
                },
            },
            ClientRequestToken: 'unique-app-token-' + Date.now(),
        };

        const command = new CreateFaceLivenessSessionCommand(params);
        return this.client.send(command);
    }
}
