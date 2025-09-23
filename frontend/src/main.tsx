import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; 
import { AuthProvider } from './context/AuthContext'; // <-- 1. Import the provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Wrap your entire App component with the AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);

