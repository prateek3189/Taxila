import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { parseWebEnv } from '@vital-track/config';
import './index.css';
import App from './App';

parseWebEnv({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
