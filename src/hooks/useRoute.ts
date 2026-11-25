import { useSyncExternalStore } from 'react';
import { isRouteId } from '../data/routes';
import type { RouteId } from '../data/routes';

// A shared link (#empleo, #clientes, #personal) opens that version of the
// portfolio. After load the route lives in memory, so in-page anchors such as
// #proyectos can change the hash without resetting the chosen route.
const EVENT = 'routechange';

export function routeFromHash(hash = location.hash): RouteId | null {
  const value = hash.slice(1);
  return isRouteId(value) ? value : null;
}

let current: RouteId | null = typeof location === 'undefined' ? null : routeFromHash();

export function setRoute(route: RouteId | null) {
  current = route;
  history.replaceState(null, '', location.pathname + location.search + (route ? `#${route}` : ''));
  dispatchEvent(new Event(EVENT));
}

// A route link followed on an already open page only fires hashchange.
if (typeof window !== 'undefined') addEventListener('hashchange', () => {
  const route = routeFromHash();
  if (route && route !== current) { current = route; dispatchEvent(new Event(EVENT)); }
});

function subscribe(callback: () => void) {
  addEventListener(EVENT, callback);
  return () => removeEventListener(EVENT, callback);
}

export function useRoute() {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
