import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { DocumentCaptureComponent } from './DocumentCaptureComponent';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('DocumentCaptureComponent', () => {
    const mockOnCapture = vi.fn();
    const mockStream = {
        getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock navigator.mediaDevices.getUserMedia
        Object.defineProperty(global.navigator, 'mediaDevices', {
            value: {
                getUserMedia: vi.fn().mockResolvedValue(mockStream),
            },
            writable: true,
        });

        // Mock HTMLVideoElement.prototype.srcObject
        Object.defineProperty(HTMLVideoElement.prototype, 'srcObject', {
            set: vi.fn(),
            configurable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders correctly and requests camera access', async () => {
        await act(async () => {
            render(<DocumentCaptureComponent onCapture={mockOnCapture} documentType="ID_FRONT" />);
        });

        expect(screen.getByText('Captura de Documento')).toBeInTheDocument();
        expect(screen.getByText(/cédula - parte frontal/i)).toBeInTheDocument();
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
        expect(screen.getByText('Cámara lista. Posiciona el documento dentro del marco.')).toBeInTheDocument();
    });

    it('handles camera access error', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        (navigator.mediaDevices.getUserMedia as any).mockRejectedValue(new Error('Permission denied'));

        await act(async () => {
            render(<DocumentCaptureComponent onCapture={mockOnCapture} documentType="ID_FRONT" />);
        });

        expect(screen.getByText('No se pudo acceder a la cámara. Por favor, verifica los permisos.')).toBeInTheDocument();
        consoleErrorSpy.mockRestore();
    });

    it('captures image successfully', async () => {
        // Mock canvas methods
        const mockContext = {
            drawImage: vi.fn(),
        };
        const mockToDataURL = vi.fn().mockReturnValue('data:image/jpeg;base64,captured-image-data');

        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext as any);
        vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(mockToDataURL);

        await act(async () => {
            render(<DocumentCaptureComponent onCapture={mockOnCapture} documentType="ID_FRONT" />);
        });

        const captureButton = screen.getByText('📸 Capturar');

        await act(async () => {
            fireEvent.click(captureButton);
        });

        expect(mockContext.drawImage).toHaveBeenCalled();
        expect(mockToDataURL).toHaveBeenCalled();
        expect(screen.getByAltText('Documento capturado')).toBeInTheDocument();
        expect(mockStream.getTracks()[0].stop).toHaveBeenCalled();
    });

    it('allows retaking photo', async () => {
        // Mock capture prerequisite
        const mockContext = { drawImage: vi.fn() };
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext as any);
        vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,test');

        await act(async () => {
            render(<DocumentCaptureComponent onCapture={mockOnCapture} documentType="ID_FRONT" />);
        });

        // Capture
        await act(async () => {
            fireEvent.click(screen.getByText('📸 Capturar'));
        });

        // Click Retake
        const retakeButton = screen.getByText('🔄 Retomar');
        await act(async () => {
            fireEvent.click(retakeButton);
        });

        expect(screen.queryByAltText('Documento capturado')).not.toBeInTheDocument();
        expect(screen.getByText('📸 Capturar')).toBeInTheDocument();
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledTimes(2); // Initial + Retake
    });

    it('confirms capture', async () => {
        // Mock capture prerequisite
        const mockContext = { drawImage: vi.fn() };
        const imageData = 'data:image/jpeg;base64,test';
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext as any);
        vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(imageData);

        await act(async () => {
            render(<DocumentCaptureComponent onCapture={mockOnCapture} documentType="ID_FRONT" />);
        });

        // Capture
        await act(async () => {
            fireEvent.click(screen.getByText('📸 Capturar'));
        });

        // Click Confirm
        const confirmButton = screen.getByText('✓ Confirmar');
        fireEvent.click(confirmButton);

        expect(mockOnCapture).toHaveBeenCalledWith(imageData);
    });
});
