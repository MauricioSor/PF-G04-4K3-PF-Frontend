// Distribuciones de probabilidad derivadas de un generador uniforme sembrado.
// Cada función recibe el `rng` (de rng.js) y consume sus propios U(0,1), de modo
// que la grilla pueda auditar exactamente qué número aleatorio produjo cada valor.

// Evita ln(0) = -Infinity cuando u cae exactamente en 0 (prob. 1/m).
const safePositive = (u) => (u > 0 ? u : 1e-12);

/**
 * Uniforme continua en [a, b):  a + (b - a)·u
 * @returns {{u:number, value:number}}
 */
export function uniform(rng, a, b) {
  const u = rng.nextU();
  return { u, value: a + (b - a) * u };
}

/**
 * Uniforme entera LITERAL del diagrama:  INT(base + span·u) = floor(base + span·u)
 * Ej.: uniformIntLiteral(rng, 5, 10) -> 5..14 (el 15 es inalcanzable porque u < 1).
 * @returns {{u:number, value:number}}
 */
export function uniformIntLiteral(rng, base, span) {
  const u = rng.nextU();
  return { u, value: Math.floor(base + span * u) };
}

/**
 * Normal(mu, sigma) por Box–Muller. Consume SIEMPRE 2 U (descarta el segundo z,
 * para no desincronizar el stream entre equipos) y hace clamp a >= 0
 * (los tiempos no pueden ser negativos).
 * @returns {{u1:number, u2:number, value:number}}
 */
export function normalBoxMuller(rng, mu, sigma) {
  const u1 = rng.nextU();
  const u2 = rng.nextU();
  const z0 = Math.sqrt(-2 * Math.log(safePositive(u1))) * Math.cos(2 * Math.PI * u2);
  return { u1, u2, value: Math.max(0, mu + sigma * z0) };
}

/**
 * Poisson(lambda) por el método multiplicativo de Knuth. Consume una cantidad
 * VARIABLE de U (en promedio ~lambda+1), todos registrados en `us`.
 * @returns {{us:number[], value:number}}
 */
export function poissonKnuth(rng, lambda) {
  const L = Math.exp(-lambda);
  const us = [];
  let k = 0;
  let p = 1;
  do {
    k += 1;
    const u = rng.nextU();
    us.push(u);
    p *= u;
  } while (p > L);
  return { us, value: k - 1 };
}

/**
 * Exponencial de media `mean`:  -mean·ln(u)
 * @returns {{u:number, value:number}}
 */
export function exponential(rng, mean) {
  const u = rng.nextU();
  return { u, value: -mean * Math.log(safePositive(u)) };
}

/**
 * Selección categórica por cortes acumulados. Para cutoffs [0.25, 0.70]:
 *   u<=0,25 -> 0 ; u<=0,70 -> 1 ; else -> 2.
 * @returns {{u:number, index:number}}
 */
export function pickByCutoffs(rng, cutoffs) {
  const u = rng.nextU();
  for (let i = 0; i < cutoffs.length; i += 1) {
    if (u <= cutoffs[i]) return { u, index: i };
  }
  return { u, index: cutoffs.length };
}
