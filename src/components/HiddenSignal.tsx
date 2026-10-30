import { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export function HiddenSignal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [holding, setHolding] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  const stop = () => { clearTimeout(timer.current); setHolding(false); };
  const open = () => {
    stop();
    if (!dialog.current?.open) dialog.current?.showModal();
  };
  return <div className="hidden-signal">
    <button ref={trigger} type="button" className={`signal-star${holding ? ' is-holding' : ''}`} aria-label="Descubrir una señal" aria-haspopup="dialog" title="Mantén pulsado o haz clic para explorar" onClick={open}
      onPointerDown={event => {
        if (event.button !== 0) return;
        stop(); setHolding(true); timer.current = setTimeout(open, 700);
      }} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop} onBlur={stop}>
      <Sparkles size={21} strokeWidth={1.4} aria-hidden="true" />
    </button>
    <dialog ref={dialog} className="project-dialog signal-dialog" aria-labelledby="signal-title" onClose={() => trigger.current?.focus({ preventScroll: true })}>
      <form method="dialog"><button className="dialog-close" aria-label="Cerrar señal" autoFocus><X size={22} /></button></form>
      <div className="signal-message"><Sparkles size={38} strokeWidth={1} aria-hidden="true" />
        <p className="eyebrow">Transmisión recibida / 001</p>
        <h2 id="signal-title">Señal encontrada</h2>
        <p>La curiosidad también forma parte de mi proceso de desarrollo.</p>
        <p>Gracias por explorar un poco más allá.</p>
        <span className="signal-signature">Adrián · HelloWork</span>
      </div>
    </dialog>
  </div>;
}
