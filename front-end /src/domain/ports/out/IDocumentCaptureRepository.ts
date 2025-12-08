import type { DocumentCapture } from '@domain/entities/DocumentCapture';

// Output port - Repository interface for Document Capture operations
export interface IDocumentCaptureRepository {
    uploadDocument(document: DocumentCapture): Promise<{ success: boolean; documentId: string; s3Key: string }>;
    validateDocument(documentId: string, s3Key: string, sessionId?: string, documentType?: string): Promise<{ isValid: boolean; confidence: number; faceMatch?: boolean }>;
}
