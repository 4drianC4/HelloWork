import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}

// Bake the original star cloud once. Unlike animated fragment noise, this costs
// only a single textured plane per frame, including on mobile.
function createSky(compact: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = compact ? 512 : 1024; canvas.height = canvas.width;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');
  const pixels = ctx.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const u = x / canvas.width, v = y / canvas.height;
      const cloud = noise(u * 7, v * 7) * .55 + noise(u * 19 + 17, v * 19) * .28
        + noise(u * 53, v * 53 + 31) * .12 + noise(u * 130, v * 130) * .05;
      // A broken diagonal Milky Way, with a darker lane through the middle.
      const distance = v - (.88 - u * .8) + (cloud - .5) * .3;
      const band = Math.exp(-distance * distance * 40);
      const lane = 1 - Math.exp(-distance * distance * 450) * .65;
      const density = Math.pow(cloud, 1.8) * band * lane;
      const edge = Math.pow(Math.sin(u * Math.PI) * Math.sin(v * Math.PI), .75);
      const i = (y * canvas.width + x) * 4;
      pixels.data[i] = 31 + cloud * 30;
      pixels.data[i + 1] = 71 + cloud * 40;
      pixels.data[i + 2] = 128 + cloud * 65;
      pixels.data[i + 3] = density * edge * 220;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  const count = compact ? 400 : 1000;
  for (let i = 0; i < count; i++) {
    const u = hash(i, 13), v = hash(i, 41);
    const edge = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
    const x = u * canvas.width, y = v * canvas.height;
    const prominent = i % 41 === 0;
    const radius = prominent ? 1.4 : .35 + hash(i, 7) * .6;
    const color = i % 9 === 0 ? '255,185,125' : i % 3 === 0 ? '139,199,255' : '225,237,255';
    if (prominent) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 9);
      glow.addColorStop(0, `rgba(${color},${edge * .7})`);
      glow.addColorStop(.2, `rgba(${color},${edge * .25})`);
      glow.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = glow; ctx.fillRect(x - 9, y - 9, 18, 18);
    }
    ctx.fillStyle = `rgba(${color},${edge * (.35 + hash(i, 97) * .6)})`;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function CosmicBackdrop({ compact }: { compact: boolean }) {
  const texture = useMemo(() => createSky(compact), [compact]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[0, 1, -14]} renderOrder={-10}>
    <planeGeometry args={[34, 34]} />
    <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
  </mesh>;
}
