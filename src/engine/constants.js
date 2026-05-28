// Parámetros por defecto del modelo "Nave Tierra" (centro de reciclaje de RAEE).
// Reflejan LITERALMENTE el diagrama de flujo TFI del grupo G04. Todos son
// configurables desde el formulario para poder explorar escenarios en la defensa.

export const DEFAULTS = {
  // --- Generador de números pseudoaleatorios (teoría Clase 1) ---
  generador: 'mixto', // 'mixto' (congruencial mixto) | 'multiplicativo'
  a: 1103515245, // constante multiplicativa (estilo glibc, periodo completo en 2^31)
  c: 12345, // constante aditiva (>0 para mixto; 0 para multiplicativo)
  m: 2147483648, // módulo = 2^31
  semilla: 2000, // valor inicial n0

  // --- Horizonte de simulación ---
  dias: 30, // jornadas laborables a simular

  // --- Llegada de lotes ---
  modoLlegadas: 'poisson', // 'poisson' (cantidad de lotes/día) | 'exponencial' (entre arribos)
  lambdaLotes: 6, // λ: lotes por día (Poisson) / lotes esperados por jornada (exponencial)
  minutosJornada: 480, // 8 horas, usado en modo exponencial

  // --- Equipos por lote: CE = INT(ceBase + ceSpan·u) ---
  ceBase: 5,
  ceSpan: 10, // INT(5 + 10u) -> 5..14

  // --- Tipo de equipo (cortes acumulados de la binomial/tabla) ---
  // u<=0,25 -> Servidor(1) ; u<=0,70 -> Switch/Router(2) ; else -> Hogareño(3)
  tipoCutoffs: [0.25, 0.7],

  // --- Peso del equipo (kg): pesoBase + pesoSpan·u  (LITERAL: igual para los 3 tipos) ---
  pesoBase: 0.5,
  pesoSpan: 19.5, // 0,5..20 kg

  // --- Tiempo de recepción: Normal(trMu, trSigma) en minutos ---
  trMu: 2,
  trSigma: 0.5,

  // --- Tiempo de diagnóstico: tdBase + tdSpan·u  (minutos) ---
  tdBase: 3,
  tdSpan: 9, // 3..12 min

  // --- Destino del equipo (cortes acumulados) ---
  // u<=0,10 -> Reutilización(EF) ; u<=0,85 -> Desarme(ED) ; else -> Disposición(EI)
  destinoCutoffs: [0.1, 0.85],

  // --- Tiempo de desarme (solo si va a Desarme): tddBase + tddSpan·u  (minutos) ---
  tddBase: 5,
  tddSpan: 50, // 5..55 min

  // --- Eficacia del procesamiento ---
  // u<=0,9905 -> Procesado correcto ; else -> Incidente de contaminación (PE++)
  eficaciaCutoff: 0.9905,

  // --- Impacto ambiental: litros de agua no contaminada por equipo procesado OK ---
  aguaPorTipo: { 1: 50000, 2: 15000, 3: 3000 },

  // --- Umbrales de decisión (TT y TTR se comparan en HORAS; TEP en unidades) ---
  umbralTT: 160,
  umbralTTR: 160,
  umbralTEP: 800,
};

// Etiquetas legibles para la UI.
export const TIPO_LABEL = {
  1: 'Servidor',
  2: 'Switch/Router',
  3: 'Hogareño',
};

export const DESTINO_LABEL = {
  EF: 'Reutilización',
  ED: 'Desarme',
  EI: 'Disposición final',
};
