import { useState } from 'react'
import './App.css'
import { LivenessComponent } from '@presentation/components/LivenessComponent'
import { DocumentCapture } from '@presentation/pages/DocumentCapture'

function App() {
  const [currentStep, setCurrentStep] = useState<'LIVENESS' | 'ID_FRONT' | 'ID_BACK' | 'SUCCESS' | 'ERROR'>('LIVENESS');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleLivenessSuccess = (confidence: number, id: string) => {
    if (confidence >= 80) {
      setSessionId(id);
      setCurrentStep('ID_FRONT');
    } else {
      setCurrentStep('ERROR');
    }
  };

  const handleFrontIdComplete = () => {
    setCurrentStep('ID_BACK');
  };

  const handleBackIdComplete = () => {
    setCurrentStep('SUCCESS');
  };

  const handleRetry = () => {
    setSessionId(null);
    setCurrentStep('LIVENESS');
  };

  return (
    <div className="App">
      <h1>Autenticador</h1>

      {currentStep === 'LIVENESS' && (
        <LivenessComponent onSuccess={handleLivenessSuccess} />
      )}

      {currentStep === 'ID_FRONT' && (
        <DocumentCapture
          initialDocumentType="ID_FRONT"
          onCaptureComplete={handleFrontIdComplete}
          onValidationFail={() => setCurrentStep('ERROR')}
          sessionId={sessionId || undefined}
        />
      )}

      {currentStep === 'ID_BACK' && (
        <DocumentCapture
          initialDocumentType="ID_BACK"
          onCaptureComplete={handleBackIdComplete}
        />
      )}

      {currentStep === 'SUCCESS' && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: '#d4edda',
          color: '#155724',
          borderRadius: '8px',
          fontSize: '1.5rem',
          marginTop: '20px'
        }}>
          <h2>¡Verificación Completa!</h2>
          <p>Has completado exitosamente todos los pasos de la verificación.</p>
        </div>
      )}

      {currentStep === 'ERROR' && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          fontSize: '1.5rem',
          marginTop: '20px'
        }}>
          <h2>Verificación Fallida</h2>
          <p>No se pudo completar la verificación de identidad.</p>
          <p style={{ fontSize: '1rem' }}>La prueba de vida no alcanzó la confianza necesaria o hubo un error en el proceso.</p>
          <button
            onClick={handleRetry}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Intentar Nuevamente
          </button>
        </div>
      )}
    </div>
  )
}

export default App

