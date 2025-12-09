import type { IDocumentCaptureRepository } from '@domain/ports/out/IDocumentCaptureRepository';
import type { DocumentCapture } from '@domain/entities/DocumentCapture';

import { EncryptionService } from '../../services/EncryptionService';

export class DocumentCaptureHttpRepository implements IDocumentCaptureRepository {
    private readonly baseUrl: string;
    private readonly encryptionService: EncryptionService;

    constructor(baseUrl: string = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.encryptionService = new EncryptionService();
    }

    async uploadDocument(document: DocumentCapture, fileName?: string): Promise<{ success: boolean; documentId: string; s3Key: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/v1/upload-document`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': '123456',
                    'channel': 'web',
                    'xname': 'kata-antigravity',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({
                    imageData: document.imageData,
                    documentType: document.documentType,
                    metadata: document.metadata,
                    fileName: fileName,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const decryptedData = typeof responseData.data === 'string'
                ? this.encryptionService.decrypt(responseData.data)
                : responseData.data;

            const data = decryptedData;

            return {
                success: true,
                documentId: data.documentId,
                s3Key: data.s3Key
            };
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    }

    async validateDocument(documentId: string, s3Key: string, sessionId?: string, documentType?: string): Promise<{ isValid: boolean; confidence: number; faceMatch?: boolean; extractedText?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/v1/validate-document`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': '123456',
                    'channel': 'web',
                    'xname': 'kata-antigravity',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({ documentId, s3Key, sessionId, documentType }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const decryptedData = typeof responseData.data === 'string'
                ? this.encryptionService.decrypt(responseData.data)
                : responseData.data;
            const data = decryptedData;
            console.log(data);

            return {
                isValid: data.isValid,
                confidence: data.confidence,
                faceMatch: data.faceMatch,
                extractedText: data.extractedText
            };
        } catch (error) {
            console.error('Error validating document:', error);
            throw error;
        }
    }
}
