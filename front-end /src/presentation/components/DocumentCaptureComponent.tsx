import { useRef, useState, useEffect } from 'react';
import './DocumentCapture.css';

interface DocumentCaptureComponentProps {
    onCapture: (imageData: string) => void;
    documentType: 'ID_FRONT' | 'ID_BACK' | 'PASSPORT' | 'DRIVER_LICENSE';
}

export const DocumentCaptureComponent = ({ onCapture, documentType }: DocumentCaptureComponentProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const documentTypeLabels = {
        ID_FRONT: 'Cédula - Parte Frontal',
        ID_BACK: 'Cédula - Parte Trasera',
        PASSPORT: 'Pasaporte',
        DRIVER_LICENSE: 'Licencia de Conducir',
    };

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                setCameraReady(true);
                setError(null);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setCameraReady(false);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(imageData);
                stopCamera();
            }
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        startCamera();
    };

    const confirmCapture = () => {
        if (capturedImage) {
            onCapture(capturedImage);
        }
    };

    return (
        <div className="document-capture-container">
            <h2 className="title">Captura de Documento</h2>
            <p className="instructions">
                Posiciona tu {documentTypeLabels[documentType].toLowerCase()} dentro del marco verde.
                <br />
                El marco tiene el tamaño real de un documento. Asegúrate de que esté bien iluminado, enfocado y que todo el documento sea visible.
            </p>

            <div className="camera-container">
                {!capturedImage ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="video-preview"
                        />
                        <div className="document-guide-overlay">
                            {documentType === 'ID_FRONT' && (
                                <div className="photo-watermark">
                                    FOTO
                                </div>
                            )}
                            {documentType === 'ID_BACK' && (
                                <div className="barcode-watermark">
                                    CÓDIGO DE BARRAS
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <img src={capturedImage} alt="Documento capturado" className="captured-image" />
                )}
                <canvas ref={canvasRef} className="canvas-hidden" />
            </div>

            {error && (
                <div className="status-message status-error">
                    {error}
                </div>
            )}

            {cameraReady && !capturedImage && (
                <div className="status-message status-info">
                    Cámara lista. Posiciona el documento dentro del marco.
                </div>
            )}

            <div className="controls-container">
                {!capturedImage ? (
                    <button
                        className="btn btn-primary"
                        onClick={captureImage}
                        disabled={!cameraReady}
                    >
                        📸 Capturar
                    </button>
                ) : (
                    <>
                        <button className="btn btn-secondary" onClick={retakePhoto}>
                            🔄 Retomar
                        </button>
                        <button className="btn btn-success" onClick={confirmCapture}>
                            ✓ Confirmar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
