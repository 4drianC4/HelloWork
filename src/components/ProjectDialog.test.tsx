// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ProjectDialog } from './ProjectDialog';
import { projects } from '../data/portfolio';

let root: Root;
let host: HTMLDivElement;
let trigger: HTMLButtonElement;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  // jsdom does not implement native modal presentation; browser QA covers it.
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function(this: HTMLDialogElement) { this.open = true; } });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function(this: HTMLDialogElement) { this.open = false; } });
  host = document.createElement('div');
  trigger = document.createElement('button');
  trigger.textContent = 'Abrir';
  document.body.append(trigger, host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove(); trigger.remove();
  document.body.style.overflow = '';
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
  vi.restoreAllMocks(); vi.unstubAllGlobals();
});

it('restores prior scroll settings and trigger focus when the log closes', async () => {
  document.body.style.overflow = 'clip';
  trigger.focus();
  await act(async () => root.render(<ProjectDialog project={projects[0]} onDismiss={() => {}} />));
  expect(host.querySelector('dialog')?.open).toBe(true);
  expect(document.body.style.overflow).toBe('hidden');
  (host.querySelector('.dialog-close') as HTMLButtonElement).focus();
  await act(async () => root.render(<ProjectDialog project={null} onDismiss={() => {}} />));
  expect(host.querySelector('dialog')?.open).toBe(false);
  expect(document.body.style.overflow).toBe('clip');
  expect(document.activeElement).toBe(trigger);
});

it('identifies team participation and offers a working close action', async () => {
  const dismiss = vi.fn();
  await act(async () => root.render(<ProjectDialog project={projects[2]} onDismiss={dismiss} />));
  expect(host.textContent).toContain('equipo ágil de 10 desarrolladores');
  expect(host.querySelector('a[href^="mailto:"]')).not.toBeNull();
  await act(async () => (host.querySelector('.dialog-close') as HTMLButtonElement).click());
  expect(dismiss).toHaveBeenCalledOnce();
});

it('ignores a delayed close event from an earlier log after another has opened', async () => {
  const dismiss = vi.fn();
  await act(async () => root.render(<ProjectDialog project={projects[0]} onDismiss={dismiss} />));
  await act(async () => root.render(<ProjectDialog project={projects[1]} onDismiss={dismiss} />));
  const dialog = host.querySelector('dialog')!;
  await act(async () => dialog.dispatchEvent(new Event('close')));
  expect(dismiss).not.toHaveBeenCalled();
  expect(dialog.open).toBe(true);
  dialog.open = false;
  await act(async () => dialog.dispatchEvent(new Event('close')));
  expect(dismiss).toHaveBeenCalledOnce();
});
