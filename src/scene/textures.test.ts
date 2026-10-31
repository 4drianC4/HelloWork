import { describe, expect, it } from 'vitest';
import { surfaceElevation } from './textures';

describe('spherical terrain', () => {
  it('wraps continuously at the longitude seam', () => {
    for (const kind of ['rock', 'ocean'] as const) {
      for (let v = 0; v <= 1; v += .05) {
        expect(surfaceElevation(kind, 0, v)).toBeCloseTo(surfaceElevation(kind, 1, v), 10);
      }
    }
  });
  it('keeps ocean basins flat and terrain inside the cloud shell', () => {
    let sea = 0, land = 0;
    for (let u = 0; u <= 1; u += .025) {
      for (let v = 0; v <= 1; v += .025) {
        const height = surfaceElevation('ocean', u, v);
        expect(height).toBeGreaterThanOrEqual(0);
        expect(height).toBeLessThan(.065);
        if (height === 0) sea++; else land++;
      }
    }
    expect(sea).toBeGreaterThan(0);
    expect(land).toBeGreaterThan(0);
  });
});
