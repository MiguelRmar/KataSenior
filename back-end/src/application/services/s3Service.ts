import { Injectable } from "@nestjs/common";
import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput
} from "@aws-sdk/client-s3";
import { IS3 } from "@domain/interfaces/IS3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Service implements IS3 {
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
        });
    }

    async uploadFile(
        bucketName: string,
        key: string,
        fileBody: Buffer | string | ReadableStream,
        contentType: string,
    ) {
        const params: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: key,
            Body: fileBody,
            ContentType: contentType
        };

        const command = new PutObjectCommand(params);

        await this.s3Client.send(command);

        return `https://s3.amazonaws.com/${bucketName}/${key}`;
    }

    async uploadDocument(body: any) {
        try {
            const { imageData, documentType, fileName } = body;

            if (!imageData) {
                return {
                    success: false,
                    error: 'No image data provided'
                };
            }

            const matches = imageData.match(/^data:(.+);base64,(.+)$/);
            let fileBuffer: Buffer;
            let contentType = 'image/jpeg';

            if (matches) {
                contentType = matches[1];
                fileBuffer = Buffer.from(matches[2], 'base64');
            } else {
                fileBuffer = Buffer.from(imageData, 'base64');
            }

            const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const extension = contentType.split('/')[1] || 'jpg';
            const s3Key = fileName
                ? `documents/${fileName}.${extension}`
                : `documents/${documentId}.${extension}`;
            const bucketName = this.configService.get<string>('AWS_BUCKET_S3', 'authenticator-bucket');

            const fileUrl = await this.uploadFile(
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
}