import { ArrowUpRight, Boxes, CalendarDays, Workflow } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { useCardDepth } from '../hooks/useCardDepth';

export const projectIcons = { events: CalendarDays, automation: Workflow, inventory: Boxes };

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const depth = useCardDepth();
  const Icon = projectIcons[project.category];
  return <article className="project-card depth-card" {...depth}>
    <div className={`project-art project-art-${project.category}`} aria-hidden="true"><Icon size={60} strokeWidth={1} /><span>{project.technologies.join(' / ')}</span></div>
    <div className="project-body"><Icon className="line-icon" size={26} strokeWidth={1.4} aria-hidden="true" />
      <h3>{project.title}</h3><p className="role">{project.role}</p><p>{project.description}</p>
      <ul className="tags" aria-label="Tecnologías">{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
      <button type="button" className="text-link project-open" aria-haspopup="dialog" aria-label={`Abrir bitácora: ${project.title}`} onClick={() => onOpen(project)}>Abrir bitácora <ArrowUpRight size={16} aria-hidden="true" /></button>
    </div>
  </article>;
}
