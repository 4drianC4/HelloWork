// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SolarSystem } from './SolarSystem';

const scene = vi.hoisted(() => ({ fail: false }));
vi.mock('./SolarCanvas', () => ({
  default: () => {
    if (scene.fail) throw new Error('WebGL unavailable');
    return <div data-testid="webgl-scene" />;
  },
}));

describe('Solar system progressive enhancement', () => {
  let root: Root;
  let host: HTMLDivElement;
  let reduced: boolean;
  let preferenceChanged: EventTarget;

  beforeEach(() => {
    scene.fail = false;
    reduced = false;
    preferenceChanged = new EventTarget();
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    vi.stubGlobal('matchMedia', (query: string) => ({
      get matches() { return query.includes('prefers-reduced-motion') && reduced; },
      media: query,
      addEventListener: preferenceChanged.addEventListener.bind(preferenceChanged),
      removeEventListener: preferenceChanged.removeEventListener.bind(preferenceChanged),
    }));
    vi.stubGlobal('IntersectionObserver', class {
      callback: IntersectionObserverCallback;
      constructor(callback: IntersectionObserverCallback) { this.callback = callback; }
      observe() { this.callback([{ isIntersecting: true }] as IntersectionObserverEntry[], this as unknown as IntersectionObserver); }
      disconnect() {}
    });
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses the static scene without mounting WebGL when reduced motion is preferred', async () => {
    reduced = true;
    await act(async () => root.render(<SolarSystem />));
    expect(host.querySelector('.solar-system')).not.toBeNull();
    expect(host.querySelector('[data-testid="webgl-scene"]')).toBeNull();
    expect(host.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('loads the enhanced scene and switches to static when the preference changes', async () => {
    await act(async () => root.render(<SolarSystem />));
    await vi.waitFor(() => expect(host.querySelector('[data-testid="webgl-scene"]')).not.toBeNull());
    await act(async () => {
      reduced = true;
      preferenceChanged.dispatchEvent(new Event('change'));
    });
    expect(host.querySelector('.solar-system')).not.toBeNull();
    expect(host.querySelector('[data-testid="webgl-scene"]')).toBeNull();
  });

  it('contains a scene failure without removing surrounding portfolio content', async () => {
    scene.fail = true;
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => root.render(<><h1>Explorar ideas</h1><SolarSystem /><a href="#contacto">Contacto</a></>));
    await vi.waitFor(() => expect(host.querySelector('.solar-system')).not.toBeNull());
    expect(host.querySelector('h1')?.textContent).toBe('Explorar ideas');
    expect(host.querySelector('a')?.getAttribute('href')).toBe('#contacto');
  });
});
