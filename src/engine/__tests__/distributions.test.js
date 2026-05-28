import { describe, it, expect } from 'vitest';
import { createRng } from '../rng.js';
import {
  uniform,
  uniformIntLiteral,
  normalBoxMuller,
  poissonKnuth,
  pickByCutoffs,
} from '../distributions.js';
import { DEFAULTS } from '../constants.js';

const newRng = () => createRng({ seed: DEFAULTS.semilla, type: 'mixto', a: DEFAULTS.a, c: DEFAULTS.c, m: DEFAULTS.m });
const N = 200000;

describe('uniform', () => {
  it('uniform(0.5, 20) tiene media ≈ 10,25 y respeta el rango', () => {
    const r = newRng();
    let sum = 0;
    for (let i = 0; i < N; i += 1) {
      const { value } = uniform(r, 0.5, 20);
      expect(value).toBeGreaterThanOrEqual(0.5);
      expect(value).toBeLessThan(20);
      sum += value;
    }
    expect(sum / N).toBeCloseTo(10.25, 1);
  });
});

describe('uniformIntLiteral (CE = INT(5 + 10u))', () => {
  it('solo produce enteros 5..14 (15 inalcanzable) con media ≈ 9,5', () => {
    const r = newRng();
    const counts = {};
    let sum = 0;
    for (let i = 0; i < N; i += 1) {
      const { value } = uniformIntLiteral(r, 5, 10);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(14);
      counts[value] = (counts[value] || 0) + 1;
      sum += value;
    }
    expect(counts[15]).toBeUndefined();
    expect(sum / N).toBeCloseTo(9.5, 1);
  });
});

describe('normalBoxMuller (Normal(2, 0.5))', () => {
  it('consume 2 U, media ≈ 2, desvío ≈ 0,5 y nunca negativo', () => {
    const r = newRng();
    const vals = [];
    for (let i = 0; i < N; i += 1) {
      const { value } = normalBoxMuller(r, 2, 0.5);
      expect(value).toBeGreaterThanOrEqual(0);
      vals.push(value);
    }
    expect(r.count()).toBe(2 * N); // exactamente 2 U por llamada
    const mean = vals.reduce((s, v) => s + v, 0) / N;
    const sd = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / N);
    expect(mean).toBeCloseTo(2, 1);
    expect(sd).toBeCloseTo(0.5, 1);
  });
});

describe('poissonKnuth (Poisson(6))', () => {
  it('media ≈ 6 y valores enteros >= 0', () => {
    const r = newRng();
    let sum = 0;
    const M = 100000;
    for (let i = 0; i < M; i += 1) {
      const { value } = poissonKnuth(r, 6);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      sum += value;
    }
    expect(sum / M).toBeCloseTo(6, 1);
  });
});

describe('pickByCutoffs', () => {
  it('[0.25, 0.70] => frecuencias ≈ 0,25 / 0,45 / 0,30', () => {
    const r = newRng();
    const counts = [0, 0, 0];
    for (let i = 0; i < N; i += 1) {
      const { index } = pickByCutoffs(r, [0.25, 0.7]);
      counts[index] += 1;
    }
    expect(counts[0] / N).toBeCloseTo(0.25, 1);
    expect(counts[1] / N).toBeCloseTo(0.45, 1);
    expect(counts[2] / N).toBeCloseTo(0.3, 1);
  });

  it('eficacia [0.9905] => index 0 ~99% del tiempo', () => {
    const r = newRng();
    let ok = 0;
    for (let i = 0; i < N; i += 1) {
      if (pickByCutoffs(r, [0.9905]).index === 0) ok += 1;
    }
    expect(ok / N).toBeCloseTo(0.9905, 2);
  });
});
