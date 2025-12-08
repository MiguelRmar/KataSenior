import type { DocumentCapture } from '@domain/entities/DocumentCapture';

// Output port - Repository interface for Document Capture operations
export interface IDocumentCaptureRepository {
    uploadDocument(document: DocumentCapture): Promise<{ success: boolean; documentId: string }>;
    validateDocument(documentId: string): Promise<{ isValid: boolean; confidence: number }>;
}
