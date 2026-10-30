// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { HiddenSignal } from './HiddenSignal';

it('opens by click or hold and cancels the pending hold when released early', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.useFakeTimers();
  const show = vi.fn(function(this: HTMLDialogElement) { this.open = true; });
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: show });
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(<HiddenSignal />));
    const button = host.querySelector('button')!;
    const dialog = host.querySelector('dialog')!;
    const pointer = (type: string) => button.dispatchEvent(Object.assign(new Event(type, { bubbles: true }), { button: 0 }));
    await act(async () => { pointer('pointerdown'); vi.advanceTimersByTime(300); pointer('pointerup'); vi.advanceTimersByTime(800); });
    expect(show).not.toHaveBeenCalled();
    await act(async () => { pointer('pointerdown'); vi.advanceTimersByTime(700); });
    expect(dialog.open).toBe(true);
    expect(show).toHaveBeenCalledOnce();
    dialog.open = false;
    await act(async () => button.click());
    expect(dialog.open).toBe(true);
    expect(show).toHaveBeenCalledTimes(2);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    vi.useRealTimers();
  }
});
