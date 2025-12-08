import {
    RekognitionClient,
    CreateFaceLivenessSessionCommand,
    CreateFaceLivenessSessionCommandOutput,
    GetFaceLivenessSessionResultsCommand,
    GetFaceLivenessSessionResultsCommandOutput,
    DetectLabelsCommand,
    DetectLabelsCommandOutput,
    CompareFacesCommand,
    CompareFacesCommandOutput
} from "@aws-sdk/client-rekognition";
import { IRekognition } from "@domain/interfaces/IRekognition";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RekognitionService implements IRekognition {
    private client: RekognitionClient;
    private accessKeyId: string | undefined;
    private secretAccessKey: string | undefined;

    constructor(private configService: ConfigService) {
        this.accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        this.secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const region = this.configService.get<string>('AWS_REGION', 'us-east-1');

        if (!this.accessKeyId || !this.secretAccessKey) {
            throw new Error('AWS credentials are not configured. Please check your .env file.');
        }

        this.client = new RekognitionClient({
            region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
            }
        });
    }

    async getAwsCredentials(): Promise<any> {
        return {
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
            sessionToken: "",
            expiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        };
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
                    S3Bucket: this.configService.get<string>('AWS_BUCKET_S3', 'authenticator-bucket'),
                    S3KeyPrefix: 'liveness-sessions/',
                },
                AuditImagesLimit: 4,
            },
            ClientRequestToken: 'unique-app-token-' + Date.now(),
        };

        const command = new CreateFaceLivenessSessionCommand(params);
        return this.client.send(command);
    }
    async detectLabels(bucketName: string, imageKey: string): Promise<DetectLabelsCommandOutput> {
        const params = {
            Image: {
                S3Object: {
                    Bucket: bucketName,
                    Name: imageKey,
                },
            },
            MaxLabels: 10,
            MinConfidence: 75,
        };
        const command = new DetectLabelsCommand(params);
        return this.client.send(command);
    }

    async compareFaces(sourceBucket: string, sourceKey: string, targetBucket: string, targetKey: string): Promise<CompareFacesCommandOutput> {
        console.log(`[DEBUG] CompareFaces (Region: ${this.client.config.region() || 'unknown'})`);
        console.log(`[DEBUG] Comparing Source: Bucket=${sourceBucket}, Key=${sourceKey}`);
        console.log(`[DEBUG] Comparing Target: Bucket=${targetBucket}, Key=${targetKey}`);

        if (!sourceBucket || !sourceKey || !targetBucket || !targetKey) {
            console.error('[ERROR] Missing parameters for CompareFaces');
            throw new Error('Missing parameters for CompareFaces');
        }

        const params = {
            SourceImage: {
                S3Object: {
                    Bucket: sourceBucket,
                    Name: decodeURIComponent(sourceKey),
                },
            },
            TargetImage: {
                S3Object: {
                    Bucket: targetBucket,
                    Name: decodeURIComponent(targetKey),
                },
            },
            // SimilarityThreshold: 80, // Optional, defaults to 80 usually. Removing to reduce error surface.
        };
        console.log('[DEBUG] CompareFaces Params:', JSON.stringify(params, null, 2));
        const command = new CompareFacesCommand(params);
        return this.client.send(command);
    }
}
