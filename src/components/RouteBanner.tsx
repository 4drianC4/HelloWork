import { ArrowUp } from 'lucide-react';
import { routeById } from '../data/routes';
import { setRoute, useRoute } from '../hooks/useRoute';

export function RouteBanner() {
  const route = routeById(useRoute());
  return <div className="route-banner wrap" id="ruta" aria-live="polite">
    {route && <>
      <p><span className="route-banner-label">Ruta · {route.title}</span>{route.intro}</p>
      <div className="route-banner-actions">
        <a href="#inicio"><ArrowUp size={15} /> Cambiar de planeta</a>
        <button type="button" onClick={() => setRoute(null)}>Ver orden general</button>
      </div>
    </>}
  </div>;
}
