import { experience } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';

export function Experience() {
  return <section className="section wrap experience-section" id="trayectoria" aria-labelledby="experience-title">
    <SectionHeading number="05" title="Trayectoria" id="experience-title" />
    <div className="timeline">{experience.map(job => <article className="experience" key={`${job.company}-${job.role}`}>
      <div><p className="company">{job.company}</p><p className="dates">{job.dates}</p></div>
      <div><h3>{job.role}</h3><p>{job.description}</p></div>
    </article>)}</div>
  </section>;
}
