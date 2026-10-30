import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SolarSystem } from '../scene/SolarSystem';

export function Hero() {
  return (
    <section className="hero-expedition" aria-labelledby="hero-title" id="inicio">
      <div className="hero-sticky wrap"><div className="hero-copy">
        <p className="eyebrow">Desarrollo web · Automatización · Cochabamba</p>
        <h1 id="hero-title">Explorar ideas.<br />Construir soluciones<span>.</span></h1>
        <p className="hero-description">Soy Adrian. Creo software para simplificar el trabajo de tu negocio.</p>
        <div className="actions"><a className="button" href="#proyectos">Ver proyectos <ArrowUpRight size={17} /></a><a className="button button-outline" href="#contacto">Cuéntame tu idea</a></div>
        <a className="scroll-cue" href="#proyectos"><ArrowDown size={18} /> Desplázate para explorar</a>
      </div>
      <SolarSystem /></div>
    </section>
  );
}
