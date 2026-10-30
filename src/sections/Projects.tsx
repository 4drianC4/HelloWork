import { ArrowUpRight, Boxes, CalendarDays, Workflow } from 'lucide-react';
import { projects } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';

const icons = { events: CalendarDays, automation: Workflow, inventory: Boxes };

export function Projects() {
  return (
    <section className="section wrap" id="proyectos" aria-labelledby="projects-title">
      <SectionHeading number="01" title="Bitácora de proyectos" id="projects-title" />
      <div className="project-grid">
        {projects.map(project => {
          const Icon = icons[project.category];
          return <article className="project-card" key={project.id}>
            <div className={`project-art project-art-${project.category}`} aria-hidden="true"><Icon size={60} strokeWidth={1} /><span>{project.technologies.join(' / ')}</span></div>
            <div className="project-body"><Icon className="line-icon" size={26} strokeWidth={1.4} />
              <h3>{project.title}</h3><p className="role">{project.role}</p><p>{project.description}</p>
              <ul className="tags" aria-label="Tecnologías">{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
              {project.url && <a className="text-link" href={project.url} target="_blank" rel="noreferrer">Ver proyecto <ArrowUpRight size={16} /></a>}
            </div>
          </article>;
        })}
      </div>
    </section>
  );
}
