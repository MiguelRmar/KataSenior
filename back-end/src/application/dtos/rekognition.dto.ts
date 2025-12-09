import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UploadDocumentDto {
    @ApiProperty({
        description: 'Base64 encoded image data',
        example: 'data:image/jpeg;base64,...'
    })
    @IsNotEmpty()
    @IsString()
    imageData: string;

    @ApiProperty({
        description: 'Type of the document',
        example: 'ID_CARD',
        required: false
    })
    @IsOptional()
    @IsString()
    documentType?: string;

    @ApiProperty({
        description: 'Name of the file',
        example: 'my-document',
        required: false
    })
    @IsOptional()
    @IsString()
    fileName?: string;
}

export class ValidateDocumentDto {
    @ApiProperty({
        description: 'Document ID returned from upload',
        example: 'doc_123456789'
    })
    @IsOptional()
    @IsString()
    documentId?: string;

    @ApiProperty({
        description: 'S3 Key of the document',
        example: 'documents/doc_123456789.jpg'
    })
    @IsNotEmpty()
    @IsString()
    s3Key: string;

    @ApiProperty({
        description: 'Type of the document for validation rules',
        example: 'ID_BACK'
    })
    @IsOptional()
    @IsString()
    documentType?: string;

    @ApiProperty({
        description: 'Session ID for face verification',
        example: 'session-id-123',
        required: false
    })
    @IsOptional()
    @IsString()
    sessionId?: string;
}
