import { useEffect, useRef, useState } from 'react';
import { Code2, Laptop, UserRound } from 'lucide-react';
import { SolarSystem } from '../scene/SolarSystem';
import { routes } from '../data/routes';
import type { RouteId } from '../data/routes';
import { setRoute, useRoute } from '../hooks/useRoute';
import { useMediaQuery } from '../hooks/useMediaQuery';

const icons = { empleo: Code2, clientes: Laptop, personal: UserRound };

export function Hero() {
  const route = useRoute();
  const [hovered, setHovered] = useState<RouteId | null>(null);
  const [placed, setPlaced] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const compact = useMediaQuery('(max-width: 640px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Cards float next to their planets only when the 3D scene is driving them.
  const floating = !compact && !reducedMotion;

  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (id: RouteId) => {
    setRoute(id);
    clearTimeout(timer.current);
    // Let the camera lean toward the planet before moving on to the content.
    timer.current = window.setTimeout(() => {
      document.getElementById('ruta')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }, reducedMotion ? 0 : 750);
  };

  return (
    <section className="hero-system" aria-labelledby="hero-title" id="inicio">
      <SolarSystem route={route} hovered={hovered} layer={layer} onSelect={choose} onPlaced={() => setPlaced(true)} />
      <div className="hero-copy wrap">
        <p className="eyebrow">Hola, soy Adrian · Cochabamba, Bolivia</p>
        <h1 id="hero-title">Desarrollador full-stack<span>.</span></h1>
        <p className="hero-description">Go, React y automatizaciones con IA.</p>
      </div>
      <div ref={layer} className={`route-layer${floating ? ' is-floating' : ''}${floating && placed ? ' is-placed' : ''}`}>
        {floating && <svg className="route-lines" aria-hidden="true">
          {routes.map(r => <g key={r.id} className={route === r.id || hovered === r.id ? 'is-active' : undefined}>
            <line data-line={r.id} /><circle data-dot={r.id} r="3.5" />
          </g>)}
        </svg>}
        <ul className="route-cards" aria-label="Elige una ruta">
          {routes.map(r => {
            const Icon = icons[r.id];
            return <li key={r.id}>
              <button type="button" className="route-card" data-route={r.id} aria-pressed={route === r.id}
                onClick={() => choose(r.id)} onPointerEnter={() => setHovered(r.id)} onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(r.id)} onBlur={() => setHovered(null)}>
                <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
                <span className="route-card-text"><strong>{r.title}</strong><span>{r.summary}</span></span>
              </button>
            </li>;
          })}
        </ul>
      </div>
      <p className="route-hint">Selecciona un planeta</p>
    </section>
  );
}
