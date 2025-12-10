// Domain entity - Document Capture
export interface DocumentCapture {
    id: string;
    imageData: string; // Base64 encoded image
    documentType: 'ID_FRONT' | 'ID_BACK' | 'PASSPORT' | 'DRIVER_LICENSE';
    capturedAt: Date;
    status: 'CAPTURED' | 'VALIDATED' | 'REJECTED';
    metadata?: {
        width?: number;
        height?: number;
        fileSize?: number;
    };
}
