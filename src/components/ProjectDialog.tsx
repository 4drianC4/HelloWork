import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { profile } from '../data/portfolio';
import { projectIcons } from './ProjectCard';

export function ProjectDialog({ project, onDismiss }: { project: Project | null; onDismiss: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!project || !dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [project]);

  const Icon = project ? projectIcons[project.category] : null;
  return <dialog className="project-dialog" ref={ref} aria-labelledby="dialog-title" onClose={() => {
    // A programmatic close queues an event. Ignore it if another log has
    // already opened, otherwise a rapid close/reopen dismisses the new log.
    if (!ref.current?.open) onDismiss();
  }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onDismiss();
  }}>
    {project && <div className="dialog-inner">
      <button type="button" className="dialog-close" aria-label="Cerrar bitácora" onClick={onDismiss} autoFocus><X size={22} /></button>
      {project.screenshot ? <figure className="dialog-screenshot"><a href={`${import.meta.env.BASE_URL}${project.screenshot.src}`} target="_blank" rel="noreferrer" aria-label={`Abrir captura completa de ${project.title} en otra pestaña`}>
        <img src={`${import.meta.env.BASE_URL}${project.screenshot.src}`} alt={project.screenshot.alt} decoding="async" />
        <span className="capture-caption">Ver captura completa <ArrowUpRight size={14} aria-hidden="true" /></span>
      </a></figure> : <div className={`dialog-art project-art-${project.category}`} aria-hidden="true">{Icon && <Icon size={64} strokeWidth={1} />}<span>HELLOWORK / BITÁCORA DE PROYECTO</span></div>}
      <div className="dialog-content">
        <p className="eyebrow">{project.role}</p>
        <h2 id="dialog-title">{project.title}</h2>
        <ul className="tags" aria-label="Tecnologías del proyecto">{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
        <section><h3>El reto</h3><p>{project.caseStudy.challenge}</p></section>
        <section><h3>Mi participación</h3><p>{project.caseStudy.contribution}</p></section>
        <section><h3>La solución</h3><ul className="solution-list">{project.caseStudy.solution.map(item => <li key={item}>{item}</li>)}</ul></section>
        <div className="dialog-actions"><a className="button" href={`mailto:${profile.email}?subject=${encodeURIComponent(`Un proyecto como ${project.title}`)}`}>Hablemos de tu proyecto <ArrowUpRight size={16} /></a>
          {project.url && <a className="text-link" href={project.url} target="_blank" rel="noreferrer">Visitar proyecto <ArrowUpRight size={16} /></a>}
        </div>
      </div>
    </div>}
  </dialog>;
}
