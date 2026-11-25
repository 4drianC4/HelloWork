import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { routeFromHash } from './hooks/useRoute';
import './styles/tokens.css';
import './styles/global.css';
import './styles/motion.css';
import './styles/landscapes.css';
import './styles/interactions.css';
import './styles/hero.css';

history.scrollRestoration = 'manual';
// Keep route links (#empleo…) so they can be shared; drop section anchors.
if (location.hash && !routeFromHash()) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo({ top: 0, behavior: 'instant' });
window.addEventListener('pageshow', () => window.scrollTo({ top: 0, behavior: 'instant' }));

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
