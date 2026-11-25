import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import {
  AdditiveBlending, Color, DoubleSide, Group, MathUtils, RingGeometry, SRGBColorSpace,
  TextureLoader, Vector3,
} from 'three';
import type { Texture } from 'three';
import { glowTexture } from './textures';
import { SolarSystemFallback } from './SolarSystemFallback';
import { CosmicBackdrop } from './CosmicBackdrop';
import { routes } from '../data/routes';
import type { RouteId } from '../data/routes';

const base = import.meta.env.BASE_URL;
const TEXTURES = ['sun.webp', 'mars.webp', 'earth.webp', 'earth-clouds.webp', 'saturn.webp', 'saturn-ring.png']
  .map(file => `${base}textures/${file}`);

type PlanetName = 'mars' | 'earth' | 'saturn';
interface PlanetLayout { orbit: number; angle: number; size: number }
interface Layout { tilt: number; camera: number; fov: number; planets: Record<PlanetName, PlanetLayout> }

// Angles are in the orbital plane; +90° points toward the camera, so the Earth
// sits in the foreground and appears large, as in the chosen design.
const wide: Layout = {
  tilt: .42, camera: 13, fov: 45,
  planets: {
    mars: { orbit: 4.4, angle: 152, size: 1 },
    earth: { orbit: 7.2, angle: 58, size: 2.4 },
    saturn: { orbit: 9.5, angle: -60, size: 1.15 },
  },
};
const narrow: Layout = {
  tilt: .5, camera: 19, fov: 50,
  planets: {
    mars: { orbit: 4.2, angle: 205, size: 1.05 },
    earth: { orbit: 7.2, angle: 72, size: 2.3 },
    saturn: { orbit: 9.5, angle: -78, size: 1.2 },
  },
};

const ORBITS = [1.6, 4.2, 7.2, 9.5];
// Where each card's leader line touches its planet, as a direction from the centre.
const ANCHORS: Record<PlanetName, [number, number]> = { mars: [-.25, -.97], earth: [.35, -.94], saturn: [.96, -.28] };
const planetOf = Object.fromEntries(routes.map(route => [route.id, route.planet])) as Record<RouteId, PlanetName>;

interface Shared {
  positions: Record<PlanetName, Vector3>;
  sizes: Record<PlanetName, number>;
}

const atmosphereVertex = `
  varying vec3 vNormal; varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;
const atmosphereFragment = `
  uniform vec3 color; uniform float strength;
  varying vec3 vNormal; varying vec3 vView;
  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
    gl_FragColor = vec4(color, rim * strength);
  }`;

function Atmosphere({ size, color, strength }: { size: number; color: string; strength: MutableRefObject<number> }) {
  const uniforms = useMemo(() => ({ color: { value: new Color(color) }, strength: { value: strength.current } }), [color, strength]);
  useFrame(() => { uniforms.strength.value = MathUtils.lerp(uniforms.strength.value, strength.current, .08); });
  return <mesh scale={1.025}>
    <sphereGeometry args={[size, 64, 48]} />
    <shaderMaterial vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment} uniforms={uniforms}
      transparent blending={AdditiveBlending} depthWrite={false} />
  </mesh>;
}

function Planet({ name, layout, tilt, shared, textures, highlighted, onSelect, compact }: {
  name: PlanetName; layout: PlanetLayout; tilt: number; shared: Shared; textures: Texture[];
  highlighted: boolean; onSelect?: () => void; compact: boolean;
}) {
  const group = useRef<Group>(null);
  const body = useRef<Group>(null);
  const clouds = useRef<Group>(null);
  const glow = useRef(.55);
  const elapsed = useRef(0);
  const [, mars, earth, cloudMap, saturn, ring] = textures;
  const { size } = layout;
  const segments = compact ? 64 : 96;

  const ringGeometry = useMemo(() => {
    if (name !== 'saturn') return null;
    const inner = size * 1.24, outer = size * 2.27;
    const geometry = new RingGeometry(inner, outer, 128, 1);
    const position = geometry.attributes.position, uv = geometry.attributes.uv;
    const vertex = new Vector3();
    // Map the radial strip texture across the ring's width.
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      uv.setXY(i, (vertex.length() - inner) / (outer - inner), .5);
    }
    return geometry;
  }, [name, size]);
  useEffect(() => () => ringGeometry?.dispose(), [ringGeometry]);

  useFrame((_, delta) => {
    const step = Math.min(delta, .05);
    elapsed.current += step;
    glow.current = highlighted ? 1.15 : .55;
    // A slow drift along the orbit keeps the scene alive without breaking the composition.
    const angle = MathUtils.degToRad(layout.angle) + Math.sin(elapsed.current * .05 + layout.orbit) * .035;
    const x = Math.cos(angle) * layout.orbit, z = Math.sin(angle) * layout.orbit;
    group.current?.position.set(x, 0, z);
    shared.positions[name].set(x, -z * Math.sin(tilt), z * Math.cos(tilt));
    shared.sizes[name] = size;
    if (body.current) body.current.rotation.y += step * (name === 'saturn' ? .06 : .035);
    if (clouds.current) clouds.current.rotation.y += step * .012;
  });

  const interaction = onSelect ? {
    onClick: (event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect(); },
    onPointerOver: () => { document.body.style.cursor = 'pointer'; },
    onPointerOut: () => { document.body.style.cursor = ''; },
  } : {};

  return <group ref={group}>
    {/* Undo the system tilt so axes and rings keep a natural inclination. */}
    <group rotation={[-tilt + (name === 'saturn' ? .42 : .2), 0, name === 'saturn' ? -.18 : .1]} {...interaction}>
      <group ref={body}>
        <mesh>
          <sphereGeometry args={[size, segments, segments * .75]} />
          {name === 'mars' && <meshStandardMaterial map={mars} bumpMap={mars} bumpScale={.6} roughness={.95} />}
          {name === 'earth' && <meshStandardMaterial map={earth} roughness={.7} />}
          {name === 'saturn' && <meshStandardMaterial map={saturn} roughness={.9} />}
        </mesh>
      </group>
      {name === 'earth' && <group ref={clouds}><mesh scale={1.008}>
        <sphereGeometry args={[size, segments, segments * .75]} />
        <meshStandardMaterial color="#ffffff" alphaMap={cloudMap} transparent depthWrite={false} roughness={1} />
      </mesh></group>}
      {ringGeometry && <mesh geometry={ringGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial map={ring} side={DoubleSide} transparent alphaTest={.02} roughness={1} />
      </mesh>}
      <Atmosphere size={size} strength={glow}
        color={name === 'earth' ? '#6fb7ff' : name === 'mars' ? '#ff9a6a' : '#ffd9a0'} />
    </group>
  </group>;
}

// Keeps the HTML cards attached to their planets as the scene drifts or the camera moves.
function CardTracker({ shared, layer, onPlaced }: { shared: Shared; layer?: RefObject<HTMLDivElement | null>; onPlaced: () => void }) {
  const { camera, size } = useThree();
  const placed = useRef(false);
  const temp = useMemo(() => [new Vector3(), new Vector3(), new Vector3()], []);
  useFrame(() => {
    const root = layer?.current;
    if (!root || !root.classList.contains('is-floating')) return;
    const right = temp[2].set(1, 0, 0).applyQuaternion(camera.quaternion);
    for (const route of routes) {
      const name = route.planet;
      const card = root.querySelector<HTMLElement>(`[data-route="${route.id}"]`);
      const line = root.querySelector<SVGLineElement>(`[data-line="${route.id}"]`);
      const dot = root.querySelector<SVGCircleElement>(`[data-dot="${route.id}"]`);
      if (!card || !line || !dot) continue;
      const center = temp[0].copy(shared.positions[name]).project(camera);
      const edge = temp[1].copy(shared.positions[name]).addScaledVector(right, shared.sizes[name]).project(camera);
      const cx = (center.x + 1) / 2 * size.width, cy = (1 - center.y) / 2 * size.height;
      const radius = Math.abs((edge.x - center.x) / 2 * size.width);
      const [dx, dy] = ANCHORS[name];
      const ax = cx + dx * radius, ay = cy + dy * radius;
      const w = card.offsetWidth, h = card.offsetHeight;
      let left = name === 'saturn' ? ax + 28 : ax - w * (name === 'mars' ? .55 : .2);
      let top = name === 'saturn' ? ay - h * .7 : ay - h - 34;
      left = MathUtils.clamp(left, 16, size.width - w - 16);
      top = MathUtils.clamp(top, 84, size.height - h - 16);
      card.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
      // Leader line from the planet to the nearest point on the card.
      const lx = MathUtils.clamp(ax, left, left + w), ly = MathUtils.clamp(ay, top, top + h);
      line.setAttribute('x1', ax.toFixed(1)); line.setAttribute('y1', ay.toFixed(1));
      line.setAttribute('x2', lx.toFixed(1)); line.setAttribute('y2', ly.toFixed(1));
      dot.setAttribute('cx', ax.toFixed(1)); dot.setAttribute('cy', ay.toFixed(1));
    }
    if (!placed.current) { placed.current = true; onPlaced(); }
  });
  return null;
}

function Rig({ layout, shared, focus }: { layout: Layout; shared: Shared; focus: PlanetName | null }) {
  const { camera } = useThree();
  const look = useRef(new Vector3());
  const goal = useMemo(() => [new Vector3(), new Vector3()], []);
  useFrame((_, delta) => {
    const [position, target] = goal;
    position.set(0, 0, layout.camera); target.set(0, 0, 0);
    if (focus) {
      // Lean toward the chosen planet instead of flying into it, so context stays visible.
      const planet = shared.positions[focus];
      target.lerp(planet, .55);
      position.lerp(planet.clone().add(new Vector3(0, 0, shared.sizes[focus] * 4.5)), .4);
    }
    const t = 1 - Math.exp(-Math.min(delta, .05) * 2.4);
    camera.position.lerp(position, t);
    look.current.lerp(target, t);
    camera.lookAt(look.current);
    if ('fov' in camera && camera.fov !== layout.fov) { camera.fov = layout.fov; camera.updateProjectionMatrix(); }
  });
  return null;
}

function System({ compact, route, hovered, layer, onSelect, onPlaced }: {
  compact: boolean; route: RouteId | null; hovered: RouteId | null;
  layer?: RefObject<HTMLDivElement | null>; onSelect?: (route: RouteId) => void; onPlaced: () => void;
}) {
  const { size } = useThree();
  const textures = useLoader(TextureLoader, TEXTURES);
  useMemo(() => textures.forEach((texture, i) => {
    if (i !== 3) texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
  }), [textures]);
  const layout = size.width / size.height < 1.05 ? narrow : wide;
  const shared = useMemo<Shared>(() => ({
    positions: { mars: new Vector3(), earth: new Vector3(), saturn: new Vector3() },
    sizes: { mars: 1, earth: 1, saturn: 1 },
  }), []);
  const glow = useMemo(() => glowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);
  const asteroids = useRef<Group>(null);
  useFrame((_, delta) => { if (asteroids.current) asteroids.current.rotation.y += Math.min(delta, .05) * .01; });
  const focus = route ? planetOf[route] : null;
  const active = hovered ?? route;

  return <>
    <ambientLight intensity={.12} />
    <pointLight position={[0, 0, 0]} color="#fff1dc" intensity={3.2} decay={0} />
    <directionalLight position={[-6, 4, 10]} intensity={.55} color="#cfe2ff" />
    <CosmicBackdrop compact={compact} />
    <Rig layout={layout} shared={shared} focus={focus} />
    <group rotation={[layout.tilt, 0, 0]}>
      <mesh><sphereGeometry args={[.7, 48, 32]} /><meshBasicMaterial map={textures[0]} color="#fff0d0" toneMapped={false} /></mesh>
      <sprite scale={[5.2, 5.2, 1]}><spriteMaterial map={glow} color="#ffcf8a" blending={AdditiveBlending} depthWrite={false} transparent opacity={.85} /></sprite>
      {ORBITS.map(radius => <Line key={radius} color="#8ddcff" transparent opacity={.2} lineWidth={.7}
        points={Array.from({ length: 161 }, (_, i) => { const a = i / 160 * Math.PI * 2; return [Math.cos(a) * radius, 0, Math.sin(a) * radius] as [number, number, number]; })} />)}
      <group ref={asteroids}>{Array.from({ length: compact ? 70 : 160 }, (_, i) => {
        const angle = i * 2.39996;
        const radius = 2.35 + (i % 11) * .09 + ((i * 37) % 7) * .02;
        return <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(i * 7) * .07, Math.sin(angle) * radius]} rotation={[i, i * .7, i * .3]}>
          <icosahedronGeometry args={[.018 + (i % 5) * .011, 0]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#b39379' : '#7b6f66'} roughness={1} flatShading />
        </mesh>;
      })}</group>
      {(['mars', 'earth', 'saturn'] as const).map(name => {
        const id = routes.find(r => r.planet === name)!.id;
        return <Planet key={name} name={name} layout={layout.planets[name]} tilt={layout.tilt} shared={shared}
          textures={textures} compact={compact} highlighted={active === id}
          onSelect={onSelect && !compact ? () => onSelect(id) : undefined} />;
      })}
    </group>
    <CardTracker shared={shared} layer={layer} onPlaced={onPlaced} />
  </>;
}

// Reveal only after actual frames have uploaded textures and rendered the scene.
function SceneReady({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => { if (++frames.current === 3) onReady(); });
  return null;
}

export interface SolarCanvasProps {
  active: boolean;
  compact: boolean;
  route?: RouteId | null;
  hovered?: RouteId | null;
  layer?: RefObject<HTMLDivElement | null>;
  onSelect?: (route: RouteId) => void;
  onPlaced?: () => void;
}

export default function SolarCanvas({ active, compact, route = null, hovered = null, layer, onSelect, onPlaced }: SolarCanvasProps) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = container.current?.querySelector('canvas');
    if (!canvas) return;
    const onLoss = () => setFailed(true);
    canvas.addEventListener('webglcontextlost', onLoss);
    return () => canvas.removeEventListener('webglcontextlost', onLoss);
  }, [failed]);
  useEffect(() => () => { document.body.style.cursor = ''; }, []);

  if (failed) return <SolarSystemFallback />;
  return <div className={`solar-canvas${ready ? ' is-ready' : ''}`} ref={container}>
    <Canvas
      resize={{ offsetSize: true }}
      frameloop={active ? 'always' : 'never'}
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, 13], fov: 45, near: .1, far: 80 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      fallback={<SolarSystemFallback />}
      onCreated={({ gl }) => gl.setClearColor(0x05070d, 0)}
    >
      <Suspense fallback={null}>
        <System compact={compact} route={route} hovered={hovered} layer={layer} onSelect={onSelect} onPlaced={onPlaced ?? (() => {})} />
        <SceneReady onReady={() => setReady(true)} />
      </Suspense>
    </Canvas>
  </div>;
}
