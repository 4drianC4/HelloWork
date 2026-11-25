import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SceneBoundary } from './SceneBoundary';
import { SolarSystemFallback } from './SolarSystemFallback';
import type { SolarCanvasProps } from './SolarCanvas';

const SolarCanvas = lazy(() => import('./SolarCanvas'));

type Props = Omit<SolarCanvasProps, 'active' | 'compact'>;

export function SolarSystem(props: Props) {
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
        <Suspense fallback={<div className="solar-loading" />}>
          <SolarCanvas active={visible && pageVisible} compact={compact} {...props} />
        </Suspense>
      </SceneBoundary>}
  </div>;
}
