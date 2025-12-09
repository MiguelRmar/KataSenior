import { Controller, Get, Post, Query, Body, Version } from "@nestjs/common";
import { RekognitionService } from "@services/rekognitionService";
import { S3Service } from "@services/s3Service";
import { ConfigService } from "@nestjs/config";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { UploadDocumentDto, ValidateDocumentDto } from "src/application/dtos/rekognition.dto";
import { CreateLivenessSessionResponse, AwsCredentialsResponse, UploadDocumentResponse, ValidateDocumentResponse } from "src/application/dtos/rekognition.response.dto";
import { ApiResponse as StandardApiResponse } from "src/application/dtos/api-response.dto";

@ApiTags('Rekognition')
@ApiExtraModels(StandardApiResponse, CreateLivenessSessionResponse, AwsCredentialsResponse, UploadDocumentResponse, ValidateDocumentResponse)
@Controller()
export class RekognitionController {
    constructor(
        private readonly rekognitionService: RekognitionService,
        private readonly s3Service: S3Service,
        private readonly configService: ConfigService
    ) { }

    @Version("1")
    @Post("create-liveness-session")
    @ApiOperation({ summary: 'Create a new Face Liveness session' })
    @ApiResponse({
        status: 201,
        schema: {
            allOf: [
                { $ref: getSchemaPath(StandardApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CreateLivenessSessionResponse),
                        },
                    },
                },
            ],
        },
    })
    async createLivenessSession() {
        return this.rekognitionService.createLivenessSession();
    }

    @Version("1")
    @Get("aws-credentials")
    @ApiOperation({ summary: 'Get temporary AWS credentials' })
    @ApiResponse({
        status: 200,
        schema: {
            allOf: [
                { $ref: getSchemaPath(StandardApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(AwsCredentialsResponse),
                        },
                    },
                },
            ],
        },
    })
    async getAwsCredentials() {
        return this.rekognitionService.getAwsCredentials();
    }

    @Version("1")
    @Get("result-session")
    @ApiOperation({ summary: 'Get results of a Face Liveness session' })
    async getSessionResult(@Query('sessionId') sessionId: string) {
        return this.rekognitionService.getSessionResult(sessionId);
    }

    @Version("1")
    @Post("upload-document")
    @ApiOperation({ summary: 'Upload a document for verification' })
    @ApiResponse({
        status: 201,
        description: 'Document uploaded successfully',
        schema: {
            allOf: [
                { $ref: getSchemaPath(StandardApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(UploadDocumentResponse),
                        },
                    },
                },
            ],
        },
    })
    @ApiBody({ type: UploadDocumentDto })
    async uploadDocument(@Body() body: UploadDocumentDto) {
        return this.s3Service.uploadDocument(body);
    }

    @Version("1")
    @Post("validate-document")
    @ApiOperation({ summary: 'Validate a document and verify face match' })
    @ApiResponse({
        status: 201,
        description: 'Validation result',
        schema: {
            allOf: [
                { $ref: getSchemaPath(StandardApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(ValidateDocumentResponse),
                        },
                    },
                },
            ],
        },
    })
    @ApiBody({ type: ValidateDocumentDto })
    async validateDocument(@Body() body: ValidateDocumentDto) {
        try {
            const { documentId, s3Key, documentType, sessionId } = body;
            if (!s3Key) {
                return {
                    isValid: false,
                    error: 'No document Key provided'
                };
            }
            const bucketName = this.configService.get<string>('AWS_BUCKET_S3', 'authenticator-bucket');

            const detectionResult = await this.rekognitionService.detectLabels(bucketName, s3Key);

            console.log(`[DEBUG] Labels detected for ${s3Key} (Type: ${documentType}):`, JSON.stringify(detectionResult.Labels, null, 2));
            const textDetectionResult = await this.rekognitionService.detectText(bucketName, s3Key);
            const detectedText = textDetectionResult.TextDetections?.filter(t => t.Type === 'LINE').map(t => t.DetectedText).join(' ');
            console.log(`[DEBUG] Text detected for ${s3Key}:`, detectedText);

            let validLabels = [
                "Document", "Id Cards", "Passport", "Driving License", "Identity Document"
            ];

            if (documentType === 'ID_BACK') {
                validLabels.push("Text", "Barcode", "Label", "Plot");
            }

            const detectedValidLabel = detectionResult.Labels?.find(
                label => validLabels.includes(label.Name!) && (label.Confidence! > 80)
            );

            let isValid = !!detectedValidLabel;
            let message = isValid ? 'Document validated successfully' : 'Document validation failed: Invalid document type';
            let faceMatch = false;
            let similarity = 0;

            if (isValid && sessionId) {
                try {
                    const sessionResult = await this.rekognitionService.getSessionResult(sessionId);

                    console.log('[DEBUG] Session Result:', JSON.stringify(sessionResult, null, 2));

                    if (sessionResult.ReferenceImage &&
                        sessionResult.ReferenceImage.S3Object &&
                        sessionResult.ReferenceImage.S3Object.Bucket &&
                        sessionResult.ReferenceImage.S3Object.Name) {
                        const sourceBucket = sessionResult.ReferenceImage.S3Object.Bucket;
                        const sourceKey = sessionResult.ReferenceImage.S3Object.Name;

                        console.log(`[DEBUG] Comparing Source (${sourceBucket}/${sourceKey}) with Target (${bucketName}/${s3Key})`);

                        const comparisonResult = await this.rekognitionService.compareFaces(
                            sourceBucket,
                            sourceKey,
                            bucketName,
                            s3Key
                        );


                        if (comparisonResult.FaceMatches && comparisonResult.FaceMatches.length > 0) {
                            const match = comparisonResult.FaceMatches[0];
                            similarity = match.Similarity || 0;
                            if (similarity > 80) {
                                faceMatch = true;
                                message += ' and Face Verified';
                            } else {
                                message += ' but Face Mismatch';
                            }
                        } else {
                            message += ' but No Face Match found';
                        }
                    } else {
                        console.warn('No ReferenceImage found in Liveness Session');
                    }
                } catch (compError) {
                    console.error('Error comparing faces:', compError);
                }
            }

            return {
                isValid,
                confidence: detectedValidLabel ? detectedValidLabel.Confidence : 0,
                similarity,
                faceMatch,
                documentId,
                foundLabels: detectionResult.Labels?.map(l => l.Name),
                extractedText: detectedText,
                message
            };
        } catch (error) {
            console.error('Error validating document:', error);
            return {
                isValid: false,
                error: 'Failed to validate document'
            };
        }
    }

}
