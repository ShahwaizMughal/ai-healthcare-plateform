import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css'; // Global CSS rules containing tailwind/tokens
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* Custom configured Toaster for success/error alerts */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#333333',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif'
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
