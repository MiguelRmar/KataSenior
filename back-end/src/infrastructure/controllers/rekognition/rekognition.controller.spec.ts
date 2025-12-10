import { Test, TestingModule } from '@nestjs/testing';
import { RekognitionController } from './rekognition';
import { RekognitionService } from '../../../application/services/rekognitionService';
import { S3Service } from '../../../application/services/s3Service';
import { ConfigService } from '@nestjs/config';
import { ValidateDocumentDto } from '../../../application/dtos/rekognition.dto';

describe('RekognitionController', () => {
    let controller: RekognitionController;
    let rekognitionServiceMock: any;
    let s3ServiceMock: any;
    let configServiceMock: any;

    beforeEach(async () => {
        rekognitionServiceMock = {
            createLivenessSession: jest.fn(),
            getAwsCredentials: jest.fn(),
            getSessionResult: jest.fn(),
            detectLabels: jest.fn(),
            detectText: jest.fn(),
            compareFaces: jest.fn(),
        };

        s3ServiceMock = {
            uploadDocument: jest.fn(),
        };

        configServiceMock = {
            get: jest.fn((key, def) => def || 'test-value'),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [RekognitionController],
            providers: [
                { provide: RekognitionService, useValue: rekognitionServiceMock },
                { provide: S3Service, useValue: s3ServiceMock },
                { provide: ConfigService, useValue: configServiceMock },
            ],
        }).compile();

        controller = module.get<RekognitionController>(RekognitionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('validateDocument', () => {
        it('should return error if s3Key is missing', async () => {
            const body: ValidateDocumentDto = {
                documentId: 'doc1',
                s3Key: '',
                documentType: 'ID_CARD'
            };
            const headers = { uuid: 'test', 'document-number': '123' };
            const result = await controller.validateDocument(body, headers);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('No document Key provided');
        });

        it('should validate successfully if document label is found', async () => {
            const body: ValidateDocumentDto = {
                documentId: 'doc1',
                s3Key: 'key.jpg',
                documentType: 'ID_CARD'
            };
            const headers = { uuid: 'test', 'document-number': '123' };

            rekognitionServiceMock.detectLabels.mockResolvedValue({
                Labels: [{ Name: 'Identity Document', Confidence: 99 }]
            });
            rekognitionServiceMock.detectText.mockResolvedValue({
                TextDetections: []
            });

            const result = await controller.validateDocument(body, headers);
            expect(result.isValid).toBe(true);
            expect(result.message).toContain('Document validated successfully');
        });

        it('should fail validation if no valid label is found', async () => {
            const body: ValidateDocumentDto = {
                documentId: 'doc1',
                s3Key: 'key.jpg',
                documentType: 'ID_CARD'
            };
            const headers = { uuid: 'test', 'document-number': '123' };

            rekognitionServiceMock.detectLabels.mockResolvedValue({
                Labels: [{ Name: 'Unknown', Confidence: 99 }]
            });
            rekognitionServiceMock.detectText.mockResolvedValue({
                TextDetections: []
            });

            const result = await controller.validateDocument(body, headers);
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('Invalid document type');
        });

        it('should verify face match if session is provided and faces match', async () => {
            const body: ValidateDocumentDto = {
                documentId: 'doc1',
                s3Key: 'key.jpg',
                documentType: 'ID_CARD',
                sessionId: 'session-123'
            };
            const headers = { uuid: 'test', 'document-number': '123' };

            rekognitionServiceMock.detectLabels.mockResolvedValue({
                Labels: [{ Name: 'Identity Document', Confidence: 99 }]
            });
            rekognitionServiceMock.detectText.mockResolvedValue({
                TextDetections: []
            });
            rekognitionServiceMock.getSessionResult.mockResolvedValue({
                ReferenceImage: {
                    S3Object: { Bucket: 'src-bucket', Name: 'src-key' }
                }
            });
            rekognitionServiceMock.compareFaces.mockResolvedValue({
                FaceMatches: [{ Similarity: 95 }]
            });

            const result = await controller.validateDocument(body, headers);
            expect(result.isValid).toBe(true);
            expect(result.faceMatch).toBe(true);
            expect(result.similarity).toBe(95);
            expect(result.message).toContain('Face Verified');
        });

        it('should report face mismatch if similarity is low', async () => {
            const body: ValidateDocumentDto = {
                documentId: 'doc1',
                s3Key: 'key.jpg',
                documentType: 'ID_CARD',
                sessionId: 'session-123'
            };
            const headers = { uuid: 'test', 'document-number': '123' };

            rekognitionServiceMock.detectLabels.mockResolvedValue({
                Labels: [{ Name: 'Identity Document', Confidence: 99 }]
            });
            rekognitionServiceMock.detectText.mockResolvedValue({
                TextDetections: []
            });
            rekognitionServiceMock.getSessionResult.mockResolvedValue({
                ReferenceImage: {
                    S3Object: { Bucket: 'src-bucket', Name: 'src-key' }
                }
            });
            rekognitionServiceMock.compareFaces.mockResolvedValue({
                FaceMatches: [{ Similarity: 50 }]
            });

            const result = await controller.validateDocument(body, headers);
            expect(result.isValid).toBe(true);
            expect(result.faceMatch).toBe(false);
            expect(result.similarity).toBe(50);
            expect(result.message).toContain('Face Mismatch');
        });

        it('should handle errors gracefully', async () => {
            const body: ValidateDocumentDto = {
                documentId: 'doc1',
                s3Key: 'key.jpg',
                documentType: 'ID_CARD'
            };
            const headers = { uuid: 'test', 'document-number': '123' };

            rekognitionServiceMock.detectLabels.mockRejectedValue(new Error('AWS Error'));

            const result = await controller.validateDocument(body, headers);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Failed to validate document');
        });
    });
});
