import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { init as initApm } from '@elastic/apm-rum'

initApm({
  serviceName: 'kata-senior-frontend',
  serverUrl: 'http://localhost:8200',
  serviceVersion: '1.0.0',
  environment: 'development',
})

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
