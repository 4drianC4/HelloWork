import { useState } from 'react';
import { projects } from '../data/portfolio';
import type { Project } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectDialog } from '../components/ProjectDialog';

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  return <section className="section wrap" id="proyectos" aria-labelledby="projects-title">
    <SectionHeading number="01" title="Bitácora de proyectos" id="projects-title" />
    <div className="project-grid">{projects.map(project => <ProjectCard key={project.id} project={project} onOpen={setSelected} />)}</div>
    <ProjectDialog project={selected} onDismiss={() => setSelected(null)} />
  </section>;
}
