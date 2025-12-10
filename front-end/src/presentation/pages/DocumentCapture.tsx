import { useState } from 'react';
import { DocumentCaptureComponent } from '@presentation/components/DocumentCaptureComponent';
import { DocumentCaptureHttpRepository } from '@infrastructure/adapters/http/DocumentCaptureHttpRepository';
import type { DocumentCapture as DocumentCaptureEntity } from '@domain/entities/DocumentCapture';

interface DocumentCaptureProps {
    onCaptureComplete?: () => void;
    onValidationFail?: () => void;
    initialDocumentType?: 'ID_FRONT' | 'ID_BACK' | 'PASSPORT' | 'DRIVER_LICENSE';
    sessionId?: string;
}

export const DocumentCapture = ({ onCaptureComplete, onValidationFail, initialDocumentType = 'ID_FRONT', sessionId }: DocumentCaptureProps) => {
    const [documentType] = useState<'ID_FRONT' | 'ID_BACK' | 'PASSPORT' | 'DRIVER_LICENSE'>(initialDocumentType);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const documentRepository = new DocumentCaptureHttpRepository();

    const handleCapture = async (imageData: string) => {
        setIsUploading(true);
        setUploadStatus('Subiendo documento...');

        try {
            const document: DocumentCaptureEntity = {
                id: crypto.randomUUID(),
                imageData,
                documentType,
                capturedAt: new Date(),
                status: 'CAPTURED',
            };

            const result = await documentRepository.uploadDocument(document);

            if (result.success) {
                setUploadStatus(`✓ Documento subido exitosamente. ID: ${result.documentId}`);
                setTimeout(async () => {
                    const validation = await documentRepository.validateDocument(result.documentId, result.s3Key, sessionId, documentType);

                    if (validation.isValid) {
                        if (validation.extractedText) {
                            console.log("Textos extraidos:", validation.extractedText);
                        }

                        // Check specifically for face match failure if it's the front ID and session ID is present
                        if (documentType === 'ID_FRONT' && sessionId && validation.faceMatch === false) {
                            setUploadStatus('⚠ Error: El rostro en el documento no coincide con la prueba de vida.');
                            setTimeout(() => {
                                if (onValidationFail) {
                                    onValidationFail();
                                }
                            }, 1500);
                            return;
                        }

                        setUploadStatus(
                            `✓ Documento validado. Confianza: ${(validation.confidence * 100).toFixed(1)}%`
                        );
                        if (onCaptureComplete) {
                            setTimeout(() => {
                                onCaptureComplete();
                            }, 1500);
                        }
                    } else {
                        setUploadStatus('⚠ El documento no pudo ser validado. Por favor, intenta nuevamente.');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            setUploadStatus('✗ Error al subir el documento. Por favor, intenta nuevamente.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#333'
            }}>
                {documentType === 'ID_FRONT' ? 'Lado Frontal' :
                    documentType === 'ID_BACK' ? 'Lado Trasero' : documentType}
            </div>

            <DocumentCaptureComponent
                onCapture={handleCapture}
                documentType={documentType}
            />

            {uploadStatus && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: uploadStatus.includes('✓') ? '#d4edda' :
                        uploadStatus.includes('✗') ? '#f8d7da' : '#d1ecf1',
                    color: uploadStatus.includes('✓') ? '#155724' :
                        uploadStatus.includes('✗') ? '#721c24' : '#0c5460',
                }}>
                    {uploadStatus}
                </div>
            )}

            {isUploading && (
                <div style={{
                    marginTop: '10px',
                    textAlign: 'center',
                    color: '#666',
                }}>
                    Procesando...
                </div>
            )}
        </div>
    );
};
