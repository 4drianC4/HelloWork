import { useEffect, useRef, useState } from 'react';

const links = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'contacto', label: 'Contacto' },
];

export function Header() {
  const [active, setActive] = useState('inicio');
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = header.current?.offsetHeight ?? 82;
      const total = document.documentElement.scrollHeight - innerHeight;
      const value = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${value})`;
      let current = 'inicio';
      for (const link of links) {
        const section = document.getElementById(link.id);
        if (section && section.getBoundingClientRect().top <= height + 120) current = link.id;
      }
      if (total > 0 && scrollY >= total - 2) current = 'contacto';
      setActive(previous => previous === current ? previous : current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    };
  }, []);

  return <header className="site-header" ref={header}><div className="header wrap">
    <a className="brand" href="#inicio" aria-label="Adrian Camara, inicio" aria-current={active === 'inicio' ? 'location' : undefined}>Adrian Camara<span aria-hidden="true">.</span></a>
    <nav aria-label="Navegación principal">{links.map(link => <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined}>{link.label}</a>)}</nav>
  </div><span className="reading-progress" ref={progress} aria-hidden="true" /></header>;
}
