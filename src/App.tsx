import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Services } from './sections/Services';
import { Process } from './sections/Process';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Contact } from './sections/Contact';
import { usePageMotion } from './hooks/usePageMotion';

export function App() {
  usePageMotion();
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header />
    <main id="contenido"><Hero /><Projects /><Services /><Process /><About /><Experience /><Contact /></main>
    <footer className="footer wrap"><span>© {new Date().getFullYear()} Adrian Camara</span><span>HelloWork · Una expedición en construcción</span></footer>
  </>;
}
