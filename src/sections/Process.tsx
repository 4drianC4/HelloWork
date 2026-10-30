import { process } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';

export function Process() {
  return <section className="process-section" id="proceso" aria-labelledby="process-title"><div className="wrap">
    <SectionHeading number="03" title="Cómo trabajo" id="process-title" />
    <ol className="process-grid">{process.map((step, index) => <li key={step.title}><span className={`process-orb process-orb-${index}`} aria-hidden="true" /><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
  </div></section>;
}
