import { ArrowUpRight, FileText, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { profile } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';
import { useRoute } from '../hooks/useRoute';

const copy = {
  empleo: { title: '¿Buscas a alguien para tu equipo', text: 'Escríbeme y te comparto mi CV o coordinamos una entrevista.' },
  clientes: { title: '¿Qué construimos juntos', text: 'Cuéntame qué necesitas resolver. Empecemos por una conversación.' },
  personal: { title: '¿Charlamos', text: 'Sobre código, enseñanza o una idea que te ronda. Siempre me gusta conversar.' },
};

export function Contact({ number }: { number: string }) {
  const route = useRoute();
  const { title, text } = copy[route ?? 'clientes'];
  // The main action follows the visitor's route; it falls back to email until a CV or WhatsApp number is added.
  const primary = route === 'empleo' && profile.cvUrl
    ? { href: profile.cvUrl, label: 'Descargar CV', Icon: FileText, external: true }
    : route === 'clientes' && profile.whatsapp
      ? { href: `https://wa.me/${profile.whatsapp}`, label: 'Escríbeme por WhatsApp', Icon: MessageCircle, external: true }
      : { href: `mailto:${profile.email}`, label: 'Hablemos', Icon: ArrowUpRight, external: false };
  const external = primary.external ? { target: '_blank', rel: 'noreferrer' } : {};

  return <section className="section wrap contact" id="contacto" aria-labelledby="contact-title">
    <SectionHeading number={number} title="Contacto" id="contact-title" />
    <div className="contact-row"><div><h3>{title}<span>?</span></h3><p>{text}</p></div>
      <a className="button" href={primary.href} {...external}>{primary.label} <primary.Icon size={18} /></a></div>
    <div className="social-links"><a href={`mailto:${profile.email}`}><Mail size={17} /> Correo</a><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a></div>
  </section>;
}
