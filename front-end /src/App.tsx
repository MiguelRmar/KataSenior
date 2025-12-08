import { useState } from 'react'
import './App.css'
import { LivenessComponent } from '@presentation/components/LivenessComponent'
import { DocumentCapture } from '@presentation/pages/DocumentCapture'

function App() {
  const [currentView, setCurrentView] = useState<'liveness' | 'document'>('liveness');

  return (
    <div className="App">
      <h1>Autenticador</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentView('liveness')}
          style={{
            padding: '10px 20px',
            background: currentView === 'liveness' ? '#667eea' : '#e0e0e0',
            color: currentView === 'liveness' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Verificación de Vida
        </button>
        <button
          onClick={() => setCurrentView('document')}
          style={{
            padding: '10px 20px',
            background: currentView === 'document' ? '#667eea' : '#e0e0e0',
            color: currentView === 'document' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Captura de Documento
        </button>
      </div>

      {currentView === 'liveness' ? <LivenessComponent /> : <DocumentCapture />}
    </div>
  )
}

export default App

