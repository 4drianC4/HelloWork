// Static, lightweight scene for the structure phase and future WebGL fallback.
// Decorative only: portfolio content never depends on a canvas loading.
export function SolarSystemFallback() {
  return (
    <div className="solar-system" aria-hidden="true">
      <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
      <div className="sun" /><div className="planet planet-red" />
      <div className="planet planet-blue" /><div className="planet planet-ringed"><span /></div>
      <span className="scene-caption">HELLOWORK / EXPEDICIÓN 001</span>
    </div>
  );
}
