import { useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { AdditiveBlending, Color, DoubleSide, Group, MathUtils, Mesh, SphereGeometry, CatmullRomCurve3, MeshBasicMaterial, Vector3 } from 'three';
import { glowTexture, planetTexture, surfaceElevation } from './textures';
import type { PlanetKind } from './textures';
import { SolarSystemFallback } from './SolarSystemFallback';
import { CosmicBackdrop } from './CosmicBackdrop';

type Progress = MutableRefObject<{ value: number }>;
const clamp = MathUtils.clamp;

function Orbit({ radius, index, progress }: { radius: number; index: number; progress: Progress }) {
  const group = useRef<Group>(null);
  const points = useMemo(() => Array.from({ length: 129 }, (_, i) => {
    const angle = i / 128 * Math.PI * 2;
    return new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  }), [radius]);
  useFrame(() => {
    if (!group.current) return;
    const reveal = clamp((progress.current.value - index * .09) * 2.3, 0, 1);
    group.current.scale.setScalar(Math.max(.001, reveal));
    group.current.visible = reveal > .01;
  });
  return <group ref={group}><Line points={points} color="#8ddcff" transparent opacity={.2} lineWidth={.65} /></group>;
}

function Planet({ kind, radius, size, angle, index, progress, compact }: {
  kind: PlanetKind; radius: number; size: number; angle: number; index: number; progress: Progress; compact: boolean;
}) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const texture = useMemo(() => planetTexture(kind), [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  const relief = useMemo(() => planetTexture(kind, true), [kind]);
  const geometry = useMemo(() => {
    const sphere = new SphereGeometry(size, compact ? 64 : 128, compact ? 48 : 96);
    const position = sphere.attributes.position, uv = sphere.attributes.uv;
    const vertex = new Vector3();
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i).normalize().multiplyScalar(size * (1 + surfaceElevation(kind, uv.getX(i), uv.getY(i))));
      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    sphere.computeVertexNormals();
    return sphere;
  }, [kind, size, compact]);
  useEffect(() => () => { relief.dispose(); geometry.dispose(); }, [relief, geometry]);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, .05);
    if (!group.current || !mesh.current) return;
    const value = progress.current.value;
    const reveal = MathUtils.smoothstep(value, .15 + index * .09, .46 + index * .09);
    // Positive belt rotation around Y decreases the angle in the XZ plane.
    const orbitAngle = angle - elapsed.current * (.0104 / Math.sqrt(radius));
    group.current.position.set(Math.cos(orbitAngle) * radius, 0, Math.sin(orbitAngle) * radius);
    group.current.scale.setScalar(Math.max(.001, reveal));
    group.current.visible = reveal > .001;
    mesh.current.rotation.y = elapsed.current * .0455 + angle;
  });
  return <group ref={group}>
    <mesh ref={mesh} geometry={geometry} rotation={[.12, angle, .08]}>
      <meshStandardMaterial map={texture} bumpMap={relief} bumpScale={kind === 'gas' ? 0 : .035} roughness={kind === 'ocean' ? .58 : .9} metalness={0} />
    </mesh>
    {kind === 'ocean' && <Clouds size={size} compact={compact} />}
    {kind === 'gas' && <group rotation={[.22, 0, -.25]}>
      {[1.5, 1.72, 1.95].map((factor, i) => <mesh key={factor} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * factor, size * (factor + .13), compact ? 64 : 128]} />
        <meshStandardMaterial color={i === 1 ? '#826b53' : '#cfb48a'} side={DoubleSide} transparent opacity={.6} roughness={1} />
      </mesh>)}
    </group>}
  </group>;
}

function Clouds({ size, compact }: { size: number; compact: boolean }) {
  const mesh = useRef<Mesh>(null);
  const texture = useMemo(() => planetTexture('cloud'), []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, delta) => { if (mesh.current) mesh.current.rotation.y += Math.min(delta, .05) * .055; });
  return <mesh ref={mesh} rotation={[.12, .5, .08]}>
    <sphereGeometry args={[size * 1.065, compact ? 48 : 96, compact ? 32 : 64]} />
    <meshStandardMaterial map={texture} transparent opacity={.8} depthWrite={false} roughness={1} />
  </mesh>;
}

function SolarArc({ index }: { index: number }) {
  const group = useRef<Group>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const elapsed = useRef(index * 5);
  const curve = useMemo(() => new CatmullRomCurve3(Array.from({ length: 41 }, (_, i) => {
    const t = i / 40 * Math.PI;
    return new Vector3(Math.cos(t) * .32, .78 + Math.sin(t) * .48, Math.sin(t * 2) * .06);
  })), []);
  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, .05);
    const phase = elapsed.current % 18;
    const strength = phase < 7 ? Math.sin(phase / 7 * Math.PI) : 0;
    if (group.current) { group.current.visible = strength > .01; group.current.scale.y = .7 + strength * .3; }
    if (material.current) material.current.opacity = strength * .85;
  });
  return <group rotation={[.3, index * 1.9, index * 2.2]}><group ref={group}>
    <mesh><tubeGeometry args={[curve, 48, .018, 6, false]} />
      <meshBasicMaterial ref={material} color="#ffb34f" transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  </group></group>;
}

// Reveal only after actual frames have uploaded textures and rendered the scene.
function SceneReady({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => { if (++frames.current === 3) onReady(); });
  return null;
}

function StarField({ compact, progress }: { compact: boolean; progress: Progress }) {
  const group = useRef<Group>(null);
  const [positions, colors] = useMemo(() => {
    const count = compact ? 100 : 260;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = ['#f4f6fa', '#8ddcff', '#5d8fff', '#ff7a86'];
    for (let i = 0; i < count; i++) {
      const t = i * 2.399963;
      const r = 3 + ((i * 137) % 101) / 101 * 7;
      positions.set([Math.cos(t) * r, Math.sin(t) * r * .62, -10 - (i % 7)], i * 3);
      new Color(palette[i % palette.length]).toArray(colors, i * 3);
    }
    return [positions, colors];
  }, [compact]);
  useFrame(() => { if (group.current) group.current.scale.setScalar(1 + progress.current.value * .12); });
  return <group ref={group}><points>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      <bufferAttribute attach="attributes-color" args={[colors, 3]} />
    </bufferGeometry>
    <pointsMaterial size={compact ? .035 : .026} vertexColors transparent opacity={.75} sizeAttenuation depthWrite={false} />
  </points></group>;
}

function System({ progress, compact }: { progress: Progress; compact: boolean }) {
  const group = useRef<Group>(null);
  const asteroids = useRef<Group>(null);
  const { camera, size } = useThree();
  const elapsed = useRef(0);
  const [sun, glow] = useMemo(() => [planetTexture('sun'), glowTexture()], []);
  useEffect(() => () => { sun.dispose(); glow.dispose(); }, [sun, glow]);
  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, .05);
    if (group.current) group.current.rotation.y = -.12 + Math.sin(elapsed.current * .012) * .035;
    if (asteroids.current) {
      const step = Math.min(delta, .05);
      asteroids.current.rotation.y += step * .014;
      asteroids.current.children.forEach((rock, index) => {
        // Small variations keep the belt from looking like a rigid wheel.
        const speed = .04 + (index % 5) * .009;
        rock.rotation.x += step * speed;
        rock.rotation.z += step * speed * .6;
      });
    }
    camera.position.z = compact || size.width / size.height < .9 ? 18 : 12.8;
  });
  return <>
    <ambientLight intensity={.38} />
    <directionalLight position={[-3, 5, 6]} intensity={1.6} color="#d9eaff" />
    <pointLight position={[0, .5, 0]} color="#ffc181" intensity={22} decay={2} />
    <CosmicBackdrop compact={compact} />
    <StarField compact={compact} progress={progress} />
    <group ref={group} rotation={[.34, -.12, .18]}>
      <mesh><sphereGeometry args={[.85, 48, 32]} /><meshBasicMaterial map={sun} color="#ffdb9b" /></mesh>
      {[0, 1, 2].map(index => <SolarArc key={index} index={index} />)}
      <sprite scale={[4.8, 4.8, 1]}><spriteMaterial map={glow} blending={AdditiveBlending} depthWrite={false} transparent opacity={.7} /></sprite>
      <group ref={asteroids}>{Array.from({ length: compact ? 30 : 65 }, (_, i) => {
        const angle = i * 2.39996;
        const radius = 2.9 + (i % 9) * .27;
        return <mesh key={`rock-${i}`} position={[Math.cos(angle) * radius, Math.sin(i * 7) * .24, Math.sin(angle) * radius]} rotation={[i, i * .7, i * .3]} scale={[1, .7 + (i % 3) * .2, .8]}>
          <icosahedronGeometry args={[.05 + (i % 7) * .023, 1]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#b39379' : '#6b605a'} roughness={1} flatShading />
        </mesh>;
      })}</group>
      {[1.65, 2.65, 3.85, 5.15].map((radius, i) => <Orbit key={radius} radius={radius} index={i} progress={progress} />)}
      <Planet kind="rock" radius={1.65} size={.23} angle={-1.3} index={0} progress={progress} compact={compact} />
      <Planet kind="rock" radius={2.65} size={.62} angle={2.5} index={1} progress={progress} compact={compact} />
      <Planet kind="ocean" radius={3.85} size={1.08} angle={.5} index={2} progress={progress} compact={compact} />
      <Planet kind="gas" radius={5.15} size={.7} angle={-1.03} index={3} progress={progress} compact={compact} />
    </group>
  </>;
}

export default function SolarCanvas({ active, compact }: { active: boolean; compact: boolean }) {
  const progress = useRef({ value: 1 });
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

  if (failed) return <SolarSystemFallback />;
  return <div className={`solar-canvas${ready ? ' is-ready' : ''}`} ref={container}>
    <Canvas
      resize={{ offsetSize: true }}
      frameloop={active ? 'always' : 'never'}
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, 16], fov: 45, near: .1, far: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      fallback={<SolarSystemFallback />}
      onCreated={({ invalidate: draw, gl }) => { gl.setClearColor(0x05070d, 0); draw(); }}
    ><System progress={progress} compact={compact} /><SceneReady onReady={() => setReady(true)} /></Canvas>
  </div>;
}
