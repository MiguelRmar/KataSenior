import {
    RekognitionClient,
    CreateFaceLivenessSessionCommand,
    CreateFaceLivenessSessionCommandOutput,
    GetFaceLivenessSessionResultsCommand,
    GetFaceLivenessSessionResultsCommandOutput
} from "@aws-sdk/client-rekognition";
import { IRekognition } from "@domain/interfaces/IRekognition";
import { Injectable } from "@nestjs/common";
import { rekognitionClient } from "@clients/rekognition/rekognition.client";

@Injectable()
export class RekognitionService implements IRekognition {
    private client: RekognitionClient;

    constructor() {
        this.client = rekognitionClient;
    }

    getSessionResult(sessionId: string): Promise<GetFaceLivenessSessionResultsCommandOutput> {
        const params = {
            SessionId: sessionId,
        };
        const command = new GetFaceLivenessSessionResultsCommand(params);
        return this.client.send(command);
    }

    createLivenessSession(): Promise<CreateFaceLivenessSessionCommandOutput> {
        const params = {
            Settings: {
                OutputConfig: {
                    S3Bucket: process.env.AWS_BUCKET_NAME || "authenticator-bucket",
                    S3KeyPrefix: 'liveness-sessions/',
                },
                AuditImagesLimit: 4,
            },
            ClientRequestToken: 'unique-app-token-' + Date.now(),
        };

        const command = new CreateFaceLivenessSessionCommand(params);
        return this.client.send(command);
    }
}
