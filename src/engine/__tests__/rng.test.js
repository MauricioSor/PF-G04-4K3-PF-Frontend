import { describe, it, expect } from 'vitest';
import { createRng, hullDobellOk } from '../rng.js';
import { DEFAULTS } from '../constants.js';

const baseOpts = { seed: DEFAULTS.semilla, type: 'mixto', a: DEFAULTS.a, c: DEFAULTS.c, m: DEFAULTS.m };

describe('createRng (congruencial mixto)', () => {
  it('es reproducible: misma semilla => misma secuencia', () => {
    const r1 = createRng(baseOpts);
    const r2 = createRng(baseOpts);
    const s1 = Array.from({ length: 20 }, () => r1.nextU());
    const s2 = Array.from({ length: 20 }, () => r2.nextU());
    expect(s1).toEqual(s2);
  });

  it('reset() vuelve a la semilla', () => {
    const r = createRng(baseOpts);
    const a = r.nextU();
    r.nextU();
    r.reset();
    expect(r.nextU()).toBe(a);
    expect(r.count()).toBe(1);
  });

  it('todos los u están en [0, 1)', () => {
    const r = createRng(baseOpts);
    for (let i = 0; i < 100000; i += 1) {
      const u = r.nextU();
      expect(u).toBeGreaterThanOrEqual(0);
      expect(u).toBeLessThan(1);
    }
    expect(r.count()).toBe(100000);
  });

  it('la media de la muestra ≈ 0,5', () => {
    const r = createRng(baseOpts);
    let sum = 0;
    const N = 200000;
    for (let i = 0; i < N; i += 1) sum += r.nextU();
    expect(sum / N).toBeCloseTo(0.5, 2); // ±0,005
  });

  it('mantiene precisión con a y m grandes (BigInt en el paso)', () => {
    // Si el paso usara Number, a*n perdería precisión y u no sería reproducible/uniforme.
    const r = createRng(baseOpts);
    const u = r.nextU();
    // primer valor determinista esperado: (a*seed + c) mod m / m
    const n1 = Number((BigInt(DEFAULTS.a) * BigInt(DEFAULTS.semilla) + BigInt(DEFAULTS.c)) % BigInt(DEFAULTS.m));
    expect(u).toBe(n1 / DEFAULTS.m);
  });
});

describe('createRng (multiplicativo)', () => {
  it('fuerza c=0 y produce u en [0,1)', () => {
    const r = createRng({ seed: 1317, type: 'multiplicativo', a: 5631, c: 999, m: 547 });
    expect(r.params.c).toBe(0);
    for (let i = 0; i < 1000; i += 1) {
      const u = r.nextU();
      expect(u).toBeGreaterThanOrEqual(0);
      expect(u).toBeLessThan(1);
    }
  });
});

describe('hullDobellOk', () => {
  it('los defaults cumplen Hull–Dobell (periodo completo)', () => {
    expect(hullDobellOk({ a: DEFAULTS.a, c: DEFAULTS.c, m: DEFAULTS.m })).toBe(true);
  });

  it('falla si gcd(c, m) != 1', () => {
    expect(hullDobellOk({ a: 5, c: 4, m: 8 })).toBe(false); // gcd(4,8)=4
  });

  it('falla con c=0 (multiplicativo no tiene periodo completo)', () => {
    expect(hullDobellOk({ a: 16807, c: 0, m: 2147483647 })).toBe(false);
  });
});
