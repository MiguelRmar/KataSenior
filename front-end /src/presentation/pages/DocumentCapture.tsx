import { useState } from 'react';
import { DocumentCaptureComponent } from '@presentation/components/DocumentCaptureComponent';
import { DocumentCaptureHttpRepository } from '@infrastructure/adapters/http/DocumentCaptureHttpRepository';
import type { DocumentCapture as DocumentCaptureEntity } from '@domain/entities/DocumentCapture';

export const DocumentCapture = () => {
    const [documentType, setDocumentType] = useState<'ID_FRONT' | 'ID_BACK' | 'PASSPORT' | 'DRIVER_LICENSE'>('ID_FRONT');
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

                // Opcional: validar el documento automáticamente
                setTimeout(async () => {
                    const validation = await documentRepository.validateDocument(result.documentId);
                    if (validation.isValid) {
                        setUploadStatus(
                            `✓ Documento validado. Confianza: ${(validation.confidence * 100).toFixed(1)}%`
                        );
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
            {/* Selector de tipo de documento */}
            <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '20px',
            }}>
                <button
                    onClick={() => setDocumentType('ID_FRONT')}
                    style={{
                        padding: '10px 20px',
                        background: documentType === 'ID_FRONT' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0',
                        color: documentType === 'ID_FRONT' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Lado Frontal
                </button>
                <button
                    onClick={() => setDocumentType('ID_BACK')}
                    style={{
                        padding: '10px 20px',
                        background: documentType === 'ID_BACK' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0',
                        color: documentType === 'ID_BACK' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Lado Trasero
                </button>
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
