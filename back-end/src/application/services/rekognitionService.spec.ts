import { Test, TestingModule } from '@nestjs/testing';
import { RekognitionService } from './rekognitionService';
import { Rekognition } from '../../infrastructure/clients/rekognition/rekognition';
import { S3Service } from './s3Service';
import { ConfigService } from '@nestjs/config';

describe('RekognitionService', () => {
    let service: RekognitionService;
    let rekognitionClientMock: Partial<Rekognition>;
    let s3ServiceMock: Partial<S3Service>;
    let configServiceMock: Partial<ConfigService>;

    beforeEach(async () => {
        rekognitionClientMock = {
            getAwsCredentials: jest.fn(),
            getSessionResult: jest.fn(),
            createLivenessSession: jest.fn(),
            detectLabels: jest.fn(),
            detectText: jest.fn(),
            compareFaces: jest.fn(),
        };

        s3ServiceMock = {};
        configServiceMock = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RekognitionService,
                { provide: Rekognition, useValue: rekognitionClientMock },
                { provide: S3Service, useValue: s3ServiceMock },
                { provide: ConfigService, useValue: configServiceMock },
            ],
        }).compile();

        service = module.get<RekognitionService>(RekognitionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call getAwsCredentials on client', async () => {
        const context = { uuid: 'test', documentNumber: '123' };
        await service.getAwsCredentials(context);
        expect(rekognitionClientMock.getAwsCredentials).toHaveBeenCalledWith(context);
    });

    it('should call getSessionResult on client', async () => {
        const sessionId = 'session-123';
        const context = { uuid: 'test', documentNumber: '123' };
        await service.getSessionResult(sessionId, context);
        expect(rekognitionClientMock.getSessionResult).toHaveBeenCalledWith(sessionId, context);
    });

    it('should call createLivenessSession on client', async () => {
        const context = { uuid: 'test', documentNumber: '123' };
        await service.createLivenessSession(context);
        expect(rekognitionClientMock.createLivenessSession).toHaveBeenCalledWith(context);
    });

    it('should call detectLabels on client', async () => {
        const bucket = 'bucket';
        const key = 'key';
        const context = { uuid: 'test', documentNumber: '123' };
        await service.detectLabels(bucket, key, context);
        expect(rekognitionClientMock.detectLabels).toHaveBeenCalledWith(bucket, key, context);
    });

    it('should call detectText on client', async () => {
        const bucket = 'bucket';
        const key = 'key';
        const context = { uuid: 'test', documentNumber: '123' };
        await service.detectText(bucket, key, context);
        expect(rekognitionClientMock.detectText).toHaveBeenCalledWith(bucket, key, context);
    });

    it('should call compareFaces on client', async () => {
        const sourceBucket = 'sb';
        const sourceKey = 'sk';
        const targetBucket = 'tb';
        const targetKey = 'tk';
        const context = { uuid: 'test', documentNumber: '123' };
        await service.compareFaces(sourceBucket, sourceKey, targetBucket, targetKey, context);
        expect(rekognitionClientMock.compareFaces).toHaveBeenCalledWith(sourceBucket, sourceKey, targetBucket, targetKey, context);
    });
});
