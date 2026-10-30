import { useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { AdditiveBlending, Color, DoubleSide, Group, MathUtils, Mesh, Vector3 } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { glowTexture, planetTexture } from './textures';
import type { PlanetKind } from './textures';
import { SolarSystemFallback } from './SolarSystemFallback';

gsap.registerPlugin(ScrollTrigger);
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
  useFrame(() => {
    if (!group.current || !mesh.current) return;
    const value = progress.current.value;
    const reveal = MathUtils.smoothstep(value, .15 + index * .09, .46 + index * .09);
    const orbitAngle = angle + value * .15;
    group.current.position.set(Math.cos(orbitAngle) * radius, 0, Math.sin(orbitAngle) * radius);
    group.current.scale.setScalar(Math.max(.001, reveal));
    group.current.visible = reveal > .001;
    mesh.current.rotation.y = value * .65 + angle;
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
  const { camera, size } = useThree();
  const [sun, glow] = useMemo(() => [planetTexture('sun'), glowTexture()], []);
  useEffect(() => () => { sun.dispose(); glow.dispose(); }, [sun, glow]);
  useFrame(() => {
    const value = progress.current.value;
    if (group.current) group.current.rotation.y = -.3 + value * .18;
    // Keep every orbit within both narrow and wide viewports.
    const distance = size.width / size.height < 1 ? 17.5 : 14;
    camera.position.z = distance + (1 - value) * 1.2;
    camera.updateProjectionMatrix();
  });
  return <>
    <ambientLight intensity={.65} />
    <directionalLight position={[-3, 5, 6]} intensity={2.1} color="#d9eaff" />
    <pointLight position={[0, .5, 0]} color="#ffc181" intensity={22} decay={2} />
    <StarField compact={compact} progress={progress} />
    <group ref={group} rotation={[.62, -.3, -.25]}>
      <mesh><sphereGeometry args={[.68, 48, 32]} /><meshBasicMaterial map={sun} color="#ffdb9b" /></mesh>
      <sprite scale={[4.8, 4.8, 1]}><spriteMaterial map={glow} blending={AdditiveBlending} depthWrite={false} transparent opacity={.7} /></sprite>
      {[1.65, 2.65, 3.85, 5.15].map((radius, i) => <Orbit key={radius} radius={radius} index={i} progress={progress} />)}
      <Planet kind="rock" radius={1.65} size={.23} angle={-1.3} index={0} progress={progress} compact={compact} />
      <Planet kind="rock" radius={2.65} size={.48} angle={2.5} index={1} progress={progress} compact={compact} />
      <Planet kind="ocean" radius={3.85} size={.72} angle={.65} index={2} progress={progress} compact={compact} />
      <Planet kind="gas" radius={5.15} size={.57} angle={-1.03} index={3} progress={progress} compact={compact} />
    </group>
  </>;
}

export default function SolarCanvas({ active, compact }: { active: boolean; compact: boolean }) {
  const progress = useRef({ value: .24 });
  const invalidate = useRef<(() => void) | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!active || failed) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = container.current?.closest('.hero');
      if (!hero) return;
      gsap.to(progress.current, {
        value: 1, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 65%', scrub: .65, invalidateOnRefresh: true },
        onUpdate: () => invalidate.current?.(),
      });
    });
    invalidate.current?.();
    return () => media.revert();
  }, [active, failed]);

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
      frameloop={active ? 'demand' : 'never'}
      dpr={compact ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 16], fov: 45, near: .1, far: 60 }}
      gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }}
      fallback={<SolarSystemFallback />}
      onCreated={({ invalidate: draw, gl }) => { invalidate.current = draw; gl.setClearColor(0x05070d, 0); draw(); }}
    ><System progress={progress} compact={compact} /></Canvas>
  </div>;
}
