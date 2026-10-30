import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SceneBoundary } from './SceneBoundary';
import { SolarSystemFallback } from './SolarSystemFallback';

const SolarCanvas = lazy(() => import('./SolarCanvas'));

export function SolarSystem() {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const compact = useMediaQuery('(max-width: 640px)');
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (container.current) observer.observe(container.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);

  return <div className="solar-stage" ref={container} aria-hidden="true">
    {reducedMotion ? <SolarSystemFallback /> :
      <SceneBoundary fallback={<SolarSystemFallback />}>
        <Suspense fallback={<SolarSystemFallback />}>
          <SolarCanvas active={visible && pageVisible} compact={compact} />
        </Suspense>
      </SceneBoundary>}
    <span className="scene-caption">HELLOWORK / EXPEDICIÓN 001</span>
  </div>;
}
