import { ApiProperty } from '@nestjs/swagger';

export class CreateLivenessSessionResponse {
    @ApiProperty({
        description: 'The unique identifier for the created session',
        example: 'b1a23c45-d678-90ef-1234-567890abcdef'
    })
    SessionId: string;
}

export class AwsCredentialsResponse {
    @ApiProperty({
        description: 'AWS Access Key ID',
        example: 'ASIAIOSFODNN7EXAMPLE'
    })
    accessKeyId: string;

    @ApiProperty({
        description: 'AWS Secret Access Key',
        example: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
    })
    secretAccessKey: string;

    @ApiProperty({
        description: 'AWS Session Token',
        example: 'AQoDYXdzEJr...'
    })
    sessionToken: string;

    @ApiProperty({
        description: 'Expiration time of the credentials',
        example: '2023-12-31T23:59:59.000Z'
    })
    expiration: Date;
}

export class UploadDocumentResponse {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'doc_123456789' })
    documentId?: string;

    @ApiProperty({ example: 'ID_CARD' })
    documentType?: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/key' })
    fileUrl?: string;

    @ApiProperty({ example: 'documents/doc.jpg' })
    s3Key?: string;

    @ApiProperty({ example: 'Document uploaded successfully' })
    message?: string;

    @ApiProperty({ example: 'No image data provided', required: false })
    error?: string;
}

export class ValidateDocumentResponse {
    @ApiProperty({ example: true })
    isValid: boolean;

    @ApiProperty({ example: 98.5 })
    confidence?: number;

    @ApiProperty({ example: 99.2 })
    similarity?: number;

    @ApiProperty({ example: true })
    faceMatch?: boolean;

    @ApiProperty({ example: 'doc_123456789' })
    documentId?: string;

    @ApiProperty({ type: [String], example: ['Document', 'Id Cards'] })
    foundLabels?: string[];

    @ApiProperty({ example: 'Sample extracted text' })
    extractedText?: string;

    @ApiProperty({ example: 'Document validated successfully and Face Verified' })
    message?: string;

    @ApiProperty({ example: 'Failed to validate document', required: false })
    error?: string;
}
