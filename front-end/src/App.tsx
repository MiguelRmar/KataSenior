import { useState, useEffect } from 'react'
import './App.css'
import { LivenessComponent } from '@presentation/components/LivenessComponent'
import { DocumentCapture } from '@presentation/pages/DocumentCapture'
import { AuthHttpRepository } from '@infrastructure/adapters/http/AuthHttpRepository'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentStep, setCurrentStep] = useState<'LIVENESS' | 'ID_FRONT' | 'ID_BACK' | 'SUCCESS' | 'ERROR'>('LIVENESS');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);

  // Auto-login effect
  useEffect(() => {
    const performAutoLogin = async () => {
      if (!token && !isAutoLoggingIn) {
        setIsAutoLoggingIn(true);
        try {
          const authRepository = new AuthHttpRepository();
          // Hardcoded credentials for kiosk/demo mode
          const result = await authRepository.login('admin', 'admin');
          if (result.success && result.token) {
            localStorage.setItem('token', result.token);
            setToken(result.token);
          } else {
            console.error('Auto-login failed:', result.error);
          }
        } catch (error) {
          console.error('Auto-login error:', error);
        } finally {
          setIsAutoLoggingIn(false);
        }
      }
    };

    performAutoLogin();
  }, [token]);


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

  const handleResetSession = () => {
    localStorage.removeItem('token');
    setToken(null);
    setSessionId(null);
    setCurrentStep('LIVENESS');
  };

  const handleRetry = () => {
    // For retry, we keep the session but reset the flow? 
    // Or if checking "que se inicie sesion y se cierre automaticamente", maybe we should reset everything on error too?
    // Let's keep retry as "try again this step/flow" but if they want to exit, they can refresh.
    // For now, retry restarts liveness within the SAME session.
    setSessionId(null);
    setCurrentStep('LIVENESS');
  };

  return (
    <div className="App">
      {!token ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <h2>Iniciando sesión segura...</h2>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div style={{ padding: '0 20px' }}>
            <h1>Autenticador</h1>
          </div>

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

              <button
                onClick={handleResetSession}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  fontSize: '1.2rem',
                  backgroundColor: '#155724',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Finalizar y Nueva Verificación
              </button>
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
        </>
      )}
    </div>
  )
}

export default App

