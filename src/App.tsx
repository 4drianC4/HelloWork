import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { RouteBanner } from './components/RouteBanner';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Services } from './sections/Services';
import { Process } from './sections/Process';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Contact } from './sections/Contact';
import { usePageMotion } from './hooks/usePageMotion';
import { useRoute } from './hooks/useRoute';
import { defaultOrder, routeById } from './data/routes';

const sections = { projects: Projects, services: Services, process: Process, about: About, experience: Experience, contact: Contact };

export function App() {
  usePageMotion();
  const route = useRoute();
  const order = routeById(route)?.order ?? defaultOrder;
  // Sections move when the route changes; recompute scroll-triggered reveals.
  useEffect(() => { requestAnimationFrame(() => ScrollTrigger.refresh()); }, [route]);
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header />
    <main id="contenido"><Hero /><RouteBanner />
      {order.map((id, index) => { const Section = sections[id]; return <Section key={id} number={String(index + 1).padStart(2, '0')} />; })}
    </main>
    <footer className="footer wrap">
      <span>© {new Date().getFullYear()} Adrian Camara</span>
      <span>Texturas planetarias: <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">Solar System Scope</a> (CC BY 4.0)</span>
      <span>HelloWork · La curiosidad marca el rumbo</span>
    </footer>
  </>;
}
