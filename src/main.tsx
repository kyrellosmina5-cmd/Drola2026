import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register PWA service worker with auto-update
if (typeof window !== 'undefined') {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('New content available, reloading...');
    },
    onOfflineReady() {
      console.log('App is ready for offline use.');
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

