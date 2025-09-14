import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// This import has been corrected from .jsx to .tsx
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
