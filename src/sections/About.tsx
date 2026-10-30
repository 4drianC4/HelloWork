import { MapPin } from 'lucide-react';
import { profile } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';

export function About() {
  return <section className="section wrap about" id="sobre-mi" aria-labelledby="about-title">
    <SectionHeading number="04" title="Sobre mí" id="about-title" />
    <div className="about-grid"><h3>Desarrollo, docencia<br />y curiosidad<span>.</span></h3><div>
      <p>Soy Adrián Cámara, desarrollador de software en Cochabamba. Me interesa crear herramientas que simplifiquen el trabajo de las personas, compartir lo que aprendo y seguir explorando nuevas ideas.</p>
      <p>Trabajo con desarrollo full-stack y automatizaciones. Mi experiencia enseñando también forma parte de cómo trabajo: escuchar, explicar y construir juntos.</p>
      <p className="location"><MapPin size={17} /> {profile.location}</p>
    </div></div>
  </section>;
}
