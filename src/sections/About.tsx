import { MapPin } from 'lucide-react';
import { profile } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';
import { HiddenSignal } from '../components/HiddenSignal';

export function About() {
  return <section className="section wrap about" id="sobre-mi" aria-labelledby="about-title">
    <SectionHeading number="04" title="Sobre mí" id="about-title" />
    <div className="about-grid"><div className="about-visual"><div className="observatory-view" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}images/observatory.webp`} alt="" loading="lazy" decoding="async" /></div>
      <figure className="portrait-card"><img src={`${import.meta.env.BASE_URL}images/adrian-camara.webp`} alt="Adrian Camara" width="360" height="480" loading="lazy" decoding="async" /><figcaption>Adrian Camara<span>Desarrollo · Docencia · Exploración</span></figcaption></figure>
    </div><div><h3>Desarrollo, docencia<br />y curiosidad<span>.</span></h3>
      <p>Soy Adrian, desarrollador de software de Cochabamba, Bolivia. En estos últimos años me sumergí de lleno en este mundo: entre ideas, código y algún «ayer funcionaba», descubrí que lo que más disfruto es construir cosas que les hagan la vida más fácil a las personas.</p>
      <p>Creo herramientas para simplificar tu trabajo con desarrollo full-stack y automatizaciones. Y si a ti también te pica la curiosidad por este mundo, me encanta compartir lo que aprendí, enseñar y explorar nuevas ideas contigo. Siempre hay algo nuevo por descubrir.</p>
      <p>Explora mis proyectos y conoce lo que podemos construir juntos. Si tienes una idea, una pregunta o ganas de aprender, estoy a <a className="about-contact-link" href="#contacto">un clic de distancia</a>. Prometo hablar en humano.</p>
      <div className="location-and-signal"><p className="location"><MapPin size={17} /> {profile.location}</p><HiddenSignal /></div>
    </div></div>
  </section>;
}
