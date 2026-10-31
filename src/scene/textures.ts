import { CanvasTexture, SRGBColorSpace } from 'three';

export type PlanetKind = 'ocean' | 'rock' | 'gas' | 'sun' | 'cloud';

// Original deterministic spherical textures: no external image requests or game assets.
// Sample a 3D field on the sphere so the longitudinal seam wraps naturally.
function field(x: number, y: number, z: number) {
  return Math.sin(x * 4.1 + Math.cos(z * 3)) * Math.cos(y * 5.3 - z * 2.1)
    + .42 * Math.sin(x * 11 + y * 8 - z * 9)
    + .18 * Math.cos(x * 29 - y * 23 + z * 17)
    + .07 * Math.sin(x * 83 + y * 71 + z * 97);
}

export function surfaceElevation(kind: PlanetKind, u: number, v: number) {
  const latitude = (1 - v) * Math.PI, longitude = u * Math.PI * 2;
  const n = field(Math.sin(latitude) * Math.cos(longitude), Math.cos(latitude), Math.sin(latitude) * Math.sin(longitude));
  if (kind === 'ocean') return Math.max(0, n - .22) * .045;
  if (kind === 'rock') return n * .018 - Math.max(0, Math.cos(n * 14)) * .008;
  return 0;
}

export function planetTexture(kind: PlanetKind, relief = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D unavailable');
  const pixels = context.createImageData(canvas.width, canvas.height);
  for (let v = 0; v < canvas.height; v++) {
    const latitude = v / (canvas.height - 1) * Math.PI;
    for (let u = 0; u < canvas.width; u++) {
      const longitude = u / (canvas.width - 1) * Math.PI * 2;
      const x = Math.sin(latitude) * Math.cos(longitude);
      const y = Math.cos(latitude);
      const z = Math.sin(latitude) * Math.sin(longitude);
      const noise = field(x, y, z);
      const detail = (Math.sin(x * 250 + y * 193 + z * 277) + 1) * 5;
      let color: number[];
      if (kind === 'ocean') {
        const land = noise > .22;
        color = land ? [65 + noise * 30, 99 + noise * 26, 73 + noise * 15] : [20, 65 + noise * 12, 111 + noise * 16];
        const cloud = Math.abs(y) > .96;
        if (cloud) color = [211, 223, 222];
      } else if (kind === 'cloud') {
        color = [235, 243, 255];
      } else if (kind === 'gas') {
        const band = Math.sin(y * 40 + noise * .7);
        color = [181 + band * 29 + noise * 12, 148 + band * 25, 111 + band * 20];
      } else if (kind === 'sun') {
        const granules = Math.sin(noise * 32 + Math.sin(x * 87) * Math.cos(z * 73)) * Math.cos(y * 91 + noise * 12);
        color = [255, 164 + noise * 12 + granules * 23, 45 + granules * 14];
      } else {
        const crater = Math.max(0, Math.cos(noise * 14)) * 18;
        color = [154 + noise * 27 - crater, 88 + noise * 19 - crater, 64 + noise * 16 - crater];
      }
      const index = (v * canvas.width + u) * 4;
      for (let channel = 0; channel < 3; channel++) pixels.data[index + channel] = color[channel] + detail;
      pixels.data[index + 3] = kind === 'cloud' ? Math.max(0, Math.min(1, (field(x * 1.8 + 3, y * 1.8, z * 1.8) - .65) * 2)) * 210 : 255;
      if (relief) {
        const height = 100 + surfaceElevation(kind, u / (canvas.width - 1), 1 - v / (canvas.height - 1)) * 1800;
        for (let channel = 0; channel < 3; channel++) pixels.data[index + channel] = height;
      }
    }
  }
  context.putImageData(pixels, 0, 0);
  const texture = new CanvasTexture(canvas);
  if (!relief) texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function glowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D unavailable');
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,210,136,.8)');
  gradient.addColorStop(.25, 'rgba(239,166,106,.35)');
  gradient.addColorStop(.6, 'rgba(239,130,60,.08)');
  gradient.addColorStop(1, 'rgba(239,130,60,0)');
  context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
  return new CanvasTexture(canvas);
}
