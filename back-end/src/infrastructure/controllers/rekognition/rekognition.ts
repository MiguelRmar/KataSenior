import { Controller, Get, Post, Query, Body, Version } from "@nestjs/common";
import { RekognitionService } from "@services/rekognitionService";
import { S3Service } from "@services/s3Service";
import { ConfigService } from "@nestjs/config";

@Controller()
export class RekognitionController {
    constructor(
        private readonly rekognitionService: RekognitionService,
        private readonly s3Service: S3Service,
        private readonly configService: ConfigService
    ) { }

    @Version("1")
    @Post("create-liveness-session")
    async createLivenessSession() {
        return this.rekognitionService.createLivenessSession();
    }

    @Version("1")
    @Get("aws-credentials")
    async getAwsCredentials() {
        return this.rekognitionService.getAwsCredentials();
    }

    @Version("1")
    @Get("result-session")
    async getSessionResult(@Query('sessionId') sessionId: string) {
        return this.rekognitionService.getSessionResult(sessionId);
    }

    @Version("1")
    @Post("upload-document")
    async uploadDocument(@Body() body: any) {
        try {
            const { imageData, documentType } = body;

            if (!imageData) {
                return {
                    success: false,
                    error: 'No image data provided'
                };
            }

            // Extract content type and buffer from base64 string
            const matches = imageData.match(/^data:(.+);base64,(.+)$/);
            let fileBuffer: Buffer;
            let contentType = 'image/jpeg'; // Default

            if (matches) {
                contentType = matches[1];
                fileBuffer = Buffer.from(matches[2], 'base64');
            } else {
                // Assume raw base64 without prefix
                fileBuffer = Buffer.from(imageData, 'base64');
            }

            const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const s3Key = `documents/${documentId}.${contentType.split('/')[1] || 'jpg'}`;
            const bucketName = this.configService.get<string>('AWS_BUCKET_S3', 'authenticator-bucket');

            const fileUrl = await this.s3Service.uploadFile(
                bucketName,
                s3Key,
                fileBuffer,
                contentType
            );

            return {
                success: true,
                documentId,
                documentType,
                fileUrl,
                s3Key,
                message: 'Document uploaded successfully'
            };
        } catch (error) {
            console.error('Error uploading document:', error);
            return {
                success: false,
                error: 'Failed to upload document'
            };
        }
    }

    @Version("1")
    @Post("validate-document")
    async validateDocument(@Body() body: any) {
        try {
            const { documentId, s3Key, documentType, sessionId } = body;
            if (!s3Key) {
                return {
                    isValid: false,
                    error: 'No document Key provided'
                };
            }
            const bucketName = this.configService.get<string>('AWS_BUCKET_S3', 'authenticator-bucket');

            // 1. Validate Document Content (Labels)
            const detectionResult = await this.rekognitionService.detectLabels(bucketName, s3Key);

            console.log(`[DEBUG] Labels detected for ${s3Key} (Type: ${documentType}):`, JSON.stringify(detectionResult.Labels, null, 2));

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

            // 2. Compare Face (if sessionId provided)
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

                        // Check similarity of the best match
                        if (comparisonResult.FaceMatches && comparisonResult.FaceMatches.length > 0) {
                            const match = comparisonResult.FaceMatches[0]; // Best match
                            similarity = match.Similarity || 0;
                            if (similarity > 80) {
                                faceMatch = true;
                                message += ' and Face Verified';
                            } else {
                                message += ' but Face Mismatch';
                                // isValid remains true because the document itself is valid
                            }
                        } else {
                            message += ' but No Face Match found';
                            // isValid remains true because the document itself is valid
                        }
                    } else {
                        console.warn('No ReferenceImage found in Liveness Session');
                    }
                } catch (compError) {
                    console.error('Error comparing faces:', compError);
                    // Proceed without failing everything? or fail?
                    // Let's log and keep isValid as is, but maybe add warning.
                }
            }

            return {
                isValid,
                confidence: detectedValidLabel ? detectedValidLabel.Confidence : 0,
                similarity,
                faceMatch,
                documentId,
                foundLabels: detectionResult.Labels?.map(l => l.Name),
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
