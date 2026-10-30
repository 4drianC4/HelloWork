import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/motion.css';

history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo({ top: 0, behavior: 'instant' });
window.addEventListener('pageshow', () => window.scrollTo({ top: 0, behavior: 'instant' }));

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
