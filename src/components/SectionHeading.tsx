export function SectionHeading({ number, title, id }: { number: string; title: string; id: string }) {
  return <h2 className="section-heading" id={id}><span>{number} /</span> {title}</h2>;
}
