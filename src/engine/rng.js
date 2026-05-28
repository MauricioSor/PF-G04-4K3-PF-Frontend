// Generadores de números pseudoaleatorios congruenciales (teoría Clase 1).
//
//   Mixto:          n_{i+1} = (a · n_i + c) mod m       u_i = n_i / m
//   Multiplicativo: n_{i+1} = (a · n_i)     mod m  (c=0) u_i = n_i / m
//
// IMPORTANTE: con a y m grandes (p. ej. a=1103515245, m=2^31) el producto a·n
// supera 2^53 y `Number` pierde precisión. Por eso el paso congruencial se hace
// con BigInt y solo se convierte a Number para calcular u = n/m.

/**
 * Crea un generador con estado. Determinista para una misma semilla/parámetros.
 * @param {{seed:number, type?:'mixto'|'multiplicativo', a?:number, c?:number, m?:number}} opts
 */
export function createRng({ seed, type = 'mixto', a, c, m }) {
  if (!Number.isFinite(m) || m <= 0) {
    throw new Error('El módulo m debe ser un entero positivo.');
  }
  if (!Number.isFinite(a) || a <= 0) {
    throw new Error('La constante multiplicativa a debe ser positiva.');
  }
  // En el multiplicativo c es siempre 0.
  const cEff = type === 'multiplicativo' ? 0 : c;
  if (!Number.isFinite(cEff) || cEff < 0) {
    throw new Error('La constante aditiva c debe ser >= 0.');
  }

  const bm = BigInt(m);
  const ba = BigInt(a);
  const bc = BigInt(cEff);
  const seed0 = ((BigInt(Math.trunc(seed)) % bm) + bm) % bm; // normaliza a [0, m)

  let state = seed0;
  let consumed = 0;

  function next() {
    state = (ba * state + bc) % bm;
    return Number(state);
  }

  function nextU() {
    consumed += 1;
    return next() / m;
  }

  function reset() {
    state = seed0;
    consumed = 0;
  }

  return {
    next,
    nextU,
    count: () => consumed,
    reset,
    params: { seed: Math.trunc(seed), type, a, c: cEff, m },
  };
}

// --- Verificación de las condiciones de Hull–Dobell (periodo completo del mixto) ---

function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

function primeFactors(n) {
  const factors = new Set();
  let x = Math.abs(n);
  for (let p = 2; p * p <= x; p += 1) {
    while (x % p === 0) {
      factors.add(p);
      x /= p;
    }
  }
  if (x > 1) factors.add(x);
  return [...factors];
}

/**
 * ¿Se cumplen las condiciones de Hull–Dobell para periodo completo (m)?
 *   1) gcd(c, m) = 1
 *   2) a ≡ 1 (mod p) para todo primo p que divide a m
 *   3) a ≡ 1 (mod 4) si 4 divide a m
 * Solo aplica al congruencial mixto (c > 0). Para el multiplicativo (c=0) devuelve false.
 * @returns {boolean}
 */
export function hullDobellOk({ a, c, m }) {
  if (!Number.isFinite(a) || !Number.isFinite(c) || !Number.isFinite(m)) return false;
  if (m <= 0 || a <= 0 || c <= 0) return false;
  if (gcd(c, m) !== 1) return false;
  for (const p of primeFactors(m)) {
    if ((a - 1) % p !== 0) return false;
  }
  if (m % 4 === 0 && (a - 1) % 4 !== 0) return false;
  return true;
}
