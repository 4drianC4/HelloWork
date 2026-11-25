// Static, lightweight alternative for reduced motion, load failures and no WebGL.
// Decorative only: portfolio content never depends on a canvas loading.
const texture = (file: string) => ({ backgroundImage: `url(${import.meta.env.BASE_URL}textures/${file})` });

export function SolarSystemFallback() {
  return (
    <div className="solar-system" aria-hidden="true">
      <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
      <div className="sun" />
      <div className="planet planet-red" style={texture('mars.webp')} />
      <div className="planet planet-blue" style={texture('earth.webp')} />
      <div className="planet planet-ringed" style={texture('saturn.webp')}><span /></div>
    </div>
  );
}
