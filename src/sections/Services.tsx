import { Box, Laptop, Workflow } from 'lucide-react';
import { services } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';

const icons = { web: Laptop, automation: Workflow, systems: Box };
export function Services() {
  return <section className="section wrap" id="servicios" aria-labelledby="services-title">
    <SectionHeading number="02" title="Servicios" id="services-title" />
    <div className="service-grid">{services.map(service => {
      const Icon = icons[service.id];
      return <article className="service-card" key={service.id}><Icon size={32} strokeWidth={1.3} className="line-icon" /><div><h3>{service.title}</h3><p>{service.description}</p></div></article>;
    })}</div>
  </section>;
}
