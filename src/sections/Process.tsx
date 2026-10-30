import { process } from '../data/portfolio';
import { SectionHeading } from '../components/SectionHeading';

const planetImages = ['explore', 'define', 'build', 'deliver'];

export function Process() {
  return <section className="process-section" id="proceso" aria-labelledby="process-title"><div className="wrap">
    <SectionHeading number="03" title="Cómo trabajo" id="process-title" />
    <ol className="process-grid">{process.map((step, index) => <li key={step.title}><img className="process-orb" src={`${import.meta.env.BASE_URL}images/planets/${planetImages[index]}.png`} alt="" width="72" height="72" loading="lazy" decoding="async" /><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
  </div></section>;
}
