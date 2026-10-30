import { useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { AdditiveBlending, Color, DoubleSide, Group, MathUtils, Mesh, Vector3 } from 'three';
import { glowTexture, planetTexture } from './textures';
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
    <mesh ref={mesh} rotation={[.12, angle, .08]}>
      <sphereGeometry args={[size, compact ? 32 : 64, compact ? 24 : 48]} />
      <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={kind === 'gas' ? .015 : .09} roughness={.88} metalness={0} />
    </mesh>
    {kind === 'gas' && <group rotation={[.22, 0, -.25]}>
      {[1.5, 1.72, 1.95].map((factor, i) => <mesh key={factor} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * factor, size * (factor + .13), compact ? 64 : 128]} />
        <meshStandardMaterial color={i === 1 ? '#826b53' : '#cfb48a'} side={DoubleSide} transparent opacity={.6} roughness={1} />
      </mesh>)}
    </group>}
  </group>;
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
      positions.set([Math.cos(t) * r, Math.sin(t) * r * .62, -2 - (i % 7)], i * 3);
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
    camera.position.z = size.width / size.height < .9 ? 18 : 12.8;
  });
  return <>
    <ambientLight intensity={.65} />
    <directionalLight position={[-3, 5, 6]} intensity={2.1} color="#d9eaff" />
    <pointLight position={[0, .5, 0]} color="#ffc181" intensity={22} decay={2} />
    <CosmicBackdrop compact={compact} />
    <StarField compact={compact} progress={progress} />
    <group ref={group} rotation={[.34, -.12, .18]}>
      <mesh><sphereGeometry args={[.85, 48, 32]} /><meshBasicMaterial map={sun} color="#ffdb9b" /></mesh>
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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = container.current?.querySelector('canvas');
    if (!canvas) return;
    const onLoss = () => setFailed(true);
    canvas.addEventListener('webglcontextlost', onLoss);
    return () => canvas.removeEventListener('webglcontextlost', onLoss);
  }, [failed]);

  if (failed) return <SolarSystemFallback />;
  return <div className="solar-canvas" ref={container}>
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={compact ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 16], fov: 45, near: .1, far: 60 }}
      gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }}
      fallback={<SolarSystemFallback />}
      onCreated={({ invalidate: draw, gl }) => { gl.setClearColor(0x05070d, 0); draw(); }}
    ><System progress={progress} compact={compact} /></Canvas>
  </div>;
}
