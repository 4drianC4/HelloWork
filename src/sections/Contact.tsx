import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';

export function Contact() {
  return <section className="section wrap contact" id="contacto" aria-labelledby="contact-title">
    <SectionHeading number="06" title="Contacto" id="contact-title" />
    <div className="contact-row"><div><h3>¿Qué construimos juntos<span>?</span></h3><p>Cuéntame qué necesitas resolver. Empecemos por una conversación.</p></div>
      <a className="button" href={`mailto:${profile.email}`}>Hablemos <ArrowUpRight size={18} /></a></div>
    <div className="social-links"><a href={`mailto:${profile.email}`}><Mail size={17} /> Correo</a><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a></div>
  </section>;
}
