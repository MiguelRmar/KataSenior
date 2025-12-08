import type { IDocumentCaptureRepository } from '@domain/ports/out/IDocumentCaptureRepository';
import type { DocumentCapture } from '@domain/entities/DocumentCapture';

export class DocumentCaptureHttpRepository implements IDocumentCaptureRepository {
    private readonly baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    async uploadDocument(document: DocumentCapture): Promise<{ success: boolean; documentId: string; s3Key: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/v1/upload-document`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: document.imageData,
                    documentType: document.documentType,
                    metadata: document.metadata,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

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

    async validateDocument(documentId: string, s3Key: string, sessionId?: string, documentType?: string): Promise<{ isValid: boolean; confidence: number; faceMatch?: boolean }> {
        try {
            const response = await fetch(`${this.baseUrl}/v1/validate-document`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ documentId, s3Key, sessionId, documentType }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            return {
                isValid: data.isValid,
                confidence: data.confidence,
                faceMatch: data.faceMatch
            };
        } catch (error) {
            console.error('Error validating document:', error);
            throw error;
        }
    }
}
