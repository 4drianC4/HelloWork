import { process } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';

const planetImages = ['explore', 'define', 'build', 'deliver'];
const examples = [
  'Por ejemplo: revisamos cómo recibes tus pedidos y dónde se pierde tiempo antes de proponer una herramienta.',
  'Por ejemplo: delimitamos qué debe hacer la primera versión y dejamos por escrito qué incluye la entrega.',
  'Por ejemplo: pruebas un avance del sistema y revisamos juntos lo que debe ajustarse.',
  'Por ejemplo: recorremos las funciones de la herramienta y acordamos cómo atender consultas después de la entrega.',
];

export function Process() {
  return <section className="process-section" id="proceso" aria-labelledby="process-title"><div className="wrap">
    <SectionHeading number="03" title="Cómo trabajo" id="process-title" />
    <ol className="process-grid">{process.map((step, index) => <li key={step.title}>
      <details className="process-detail"><summary aria-label={`${step.title}: ver ejemplo`}>
        <img className="process-orb" src={`${import.meta.env.BASE_URL}images/planets/${planetImages[index]}.png`} alt="" width="72" height="72" loading="lazy" decoding="async" />
        <span className="step-number">0{index + 1}</span><span className="process-title">{step.title}</span><span className="process-summary-description">{step.description}</span><span className="process-action">Explorar etapa <span aria-hidden="true">+</span></span>
      </summary><p className="process-example">{examples[index]}</p></details>
    </li>)}</ol>
  </div></section>;
}
