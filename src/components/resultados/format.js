// Helpers de formato para la UI de resultados (locale es-AR).
const nfInt = new Intl.NumberFormat('es-AR');
const nf2 = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtInt = (n) => nfInt.format(Math.round(n ?? 0));
export const fmt2 = (n) => nf2.format(n ?? 0);
export const fmtU = (u) => (u == null ? '—' : u.toFixed(4));
