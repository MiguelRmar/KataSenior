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
}