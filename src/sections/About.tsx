import { MapPin } from 'lucide-react';
import { profile } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';
import { HiddenSignal } from '../components/HiddenSignal';

export function About() {
  return <section className="section wrap about" id="sobre-mi" aria-labelledby="about-title">
    <SectionHeading number="04" title="Sobre mí" id="about-title" />
    <div className="about-grid"><div className="observatory-view" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}images/observatory.webp`} alt="" loading="lazy" decoding="async" /></div><div><h3>Desarrollo, docencia<br />y curiosidad<span>.</span></h3>
      <p>Soy Adrian Camara, desarrollador de software en Cochabamba. Me interesa crear herramientas que simplifiquen el trabajo de las personas, compartir lo que aprendo y seguir explorando nuevas ideas.</p>
      <p>Trabajo con desarrollo full-stack y automatizaciones. Mi experiencia enseñando también forma parte de cómo trabajo: escuchar, explicar y construir juntos.</p>
      <div className="location-and-signal"><p className="location"><MapPin size={17} /> {profile.location}</p><HiddenSignal /></div>
    </div></div>
  </section>;
}
