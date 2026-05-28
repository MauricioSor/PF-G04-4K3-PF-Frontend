// Orquestador de la simulación del centro "Nave Tierra".
// Implementa LITERALMENTE el diagrama de flujo TFI del grupo G04.
// Es determinista: una misma config produce siempre el mismo resultado.

import { createRng } from './rng.js';
import {
  uniform,
  uniformIntLiteral,
  normalBoxMuller,
  poissonKnuth,
  exponential,
  pickByCutoffs,
} from './distributions.js';
import { DEFAULTS, TIPO_LABEL, DESTINO_LABEL } from './constants.js';

const DESTINO_KEY = ['EF', 'ED', 'EI']; // índice de destinoCutoffs -> clave

/**
 * Calcula la cantidad de lotes de un día.
 * Modo 'poisson': L ~ Poisson(lambda).
 * Modo 'exponencial': cuenta arribos con tiempo entre llegadas exponencial
 * (media = minutosJornada / lambda) hasta agotar la jornada.
 */
function lotesDelDia(rng, cfg) {
  if (cfg.modoLlegadas === 'exponencial') {
    const media = cfg.minutosJornada / cfg.lambdaLotes;
    let reloj = 0;
    let L = 0;
    for (;;) {
      const { value: dt } = exponential(rng, media);
      reloj += dt;
      if (reloj > cfg.minutosJornada) break;
      L += 1;
    }
    return L;
  }
  return poissonKnuth(rng, cfg.lambdaLotes).value;
}

/**
 * Ejecuta la simulación completa.
 * @param {object} userConfig - se mezcla sobre DEFAULTS.
 * @param {{collectGrid?:boolean}} opts - si recolectar la grilla por equipo.
 * @returns {object} SimulacionResult
 */
export function runSimulacion(userConfig = {}, opts = {}) {
  const collectGrid = opts.collectGrid !== false;
  const cfg = { ...DEFAULTS, ...userConfig };

  const rng = createRng({
    seed: cfg.semilla,
    type: cfg.generador,
    a: cfg.a,
    c: cfg.c,
    m: cfg.m,
  });

  // Acumuladores globales del mes.
  let CS = 0, CR = 0, ER = 0; // equipos por tipo
  let EF = 0, ED = 0, EI = 0; // destinos
  let PE = 0; // incidentes de contaminación
  let TA = 0; // litros de agua no contaminada
  let PT = 0; // peso total procesado (kg)
  let TTR = 0, TTD = 0, TTDD = 0; // tiempos acumulados (min)

  const grilla = [];
  const diario = [];
  let totalLotes = 0;
  let idx = 0;

  for (let d = 1; d <= cfg.dias; d += 1) {
    const L = lotesDelDia(rng, cfg);
    totalLotes += L;

    // Contadores del día.
    let eqDia = 0, csDia = 0, crDia = 0, erDia = 0;
    let efDia = 0, edDia = 0, eiDia = 0, peDia = 0;
    let pesoDia = 0, aguaDia = 0;

    for (let i = 1; i <= L; i += 1) {
      const CE = uniformIntLiteral(rng, cfg.ceBase, cfg.ceSpan).value;

      for (let e = 1; e <= CE; e += 1) {
        idx += 1;

        // 1) Tipo de equipo
        const tp = pickByCutoffs(rng, cfg.tipoCutoffs);
        const tipo = tp.index + 1; // 1=Servidor, 2=Switch/Router, 3=Hogareño
        if (tipo === 1) { CS += 1; csDia += 1; }
        else if (tipo === 2) { CR += 1; crDia += 1; }
        else { ER += 1; erDia += 1; }

        // 2) Peso (LITERAL: misma fórmula para los 3 tipos)
        const pe = uniform(rng, cfg.pesoBase, cfg.pesoBase + cfg.pesoSpan);
        PT += pe.value;
        pesoDia += pe.value;

        // 3) Tiempo de recepción ~ Normal(trMu, trSigma)
        const tr = normalBoxMuller(rng, cfg.trMu, cfg.trSigma);
        TTR += tr.value;

        // 4) Tiempo de diagnóstico = tdBase + tdSpan·u
        const td = uniform(rng, cfg.tdBase, cfg.tdBase + cfg.tdSpan);
        TTD += td.value;

        // 5) Destino del equipo
        const de = pickByCutoffs(rng, cfg.destinoCutoffs);
        const destino = DESTINO_KEY[de.index];
        let tdd = null;
        let uTDD = null;
        if (destino === 'EF') { EF += 1; efDia += 1; }
        else if (destino === 'ED') {
          ED += 1; edDia += 1;
          const r = uniform(rng, cfg.tddBase, cfg.tddBase + cfg.tddSpan);
          tdd = r.value; uTDD = r.u;
          TTDD += tdd;
        } else { EI += 1; eiDia += 1; }

        // 6) Eficacia del procesamiento
        const ef = pickByCutoffs(rng, [cfg.eficaciaCutoff]);
        const ok = ef.index === 0;
        let agua = 0;
        if (ok) { agua = cfg.aguaPorTipo[tipo]; TA += agua; }
        else { PE += 1; peDia += 1; }

        aguaDia += agua;
        eqDia += 1;

        if (collectGrid) {
          grilla.push({
            idx,
            dia: d,
            lote: i,
            equipoEnLote: e,
            uTipo: tp.u, tipo, tipoLabel: TIPO_LABEL[tipo],
            uPeso: pe.u, peso: pe.value,
            uTR1: tr.u1, uTR2: tr.u2, tr: tr.value,
            uTD: td.u, td: td.value,
            uDestino: de.u, destino, destinoLabel: DESTINO_LABEL[destino],
            uTDD, tdd,
            uEficacia: ef.u, ok, agua,
            acTTR: TTR, acTTD: TTD, acTTDD: TTDD, acTT: TTD + TTDD,
            acTA: TA, acPT: PT, acTEP: idx,
          });
        }
      }
    }

    diario.push({
      dia: d,
      lotes: L,
      equipos: eqDia,
      cs: csDia, cr: crDia, er: erDia,
      pesoDia,
      ef: efDia, ed: edDia, ei: eiDia,
      pe: peDia,
      aguaDia,
    });
  }

  const TEP = CS + CR + ER;
  const TT = TTD + TTDD;
  const ttHoras = TT / 60;
  const ttrHoras = TTR / 60;

  const resumen = {
    dias: cfg.dias,
    totalLotes,
    tep: TEP,
    cs: CS, cr: CR, er: ER,
    pt: PT,
    ta: TA,
    pe: PE,
    ef: EF, ed: ED, ei: EI,
    ttr: TTR, ttd: TTD, ttdd: TTDD, tt: TT,
    ttrHoras, ttHoras,
  };

  const decisiones = [
    {
      clave: 'operario',
      metrica: 'TT', valor: ttHoras, unidad: 'horas', umbral: cfg.umbralTT,
      condicion: `TT > ${cfg.umbralTT} h`,
      cumple: ttHoras > cfg.umbralTT,
      mensaje: ttHoras > cfg.umbralTT ? 'Invertir en un nuevo operario' : 'Sin inversiones',
    },
    {
      clave: 'recepcionista',
      metrica: 'TTR', valor: ttrHoras, unidad: 'horas', umbral: cfg.umbralTTR,
      condicion: `TTR > ${cfg.umbralTTR} h`,
      cumple: ttrHoras > cfg.umbralTTR,
      mensaje: ttrHoras > cfg.umbralTTR ? 'Invertir en un nuevo Recepcionista' : 'Sin inversiones',
    },
    {
      clave: 'segundoTurno',
      metrica: 'TEP', valor: TEP, unidad: 'equipos', umbral: cfg.umbralTEP,
      condicion: `TEP > ${cfg.umbralTEP}`,
      cumple: TEP > cfg.umbralTEP,
      mensaje: TEP > cfg.umbralTEP
        ? 'Habilitar un segundo turno de trabajo o buscar un convenio'
        : 'La operación en un único turno es suficiente',
    },
  ];

  return {
    config: cfg,
    rng: { ...rng.params, totalUConsumidos: rng.count() },
    grilla,
    diario,
    resumen,
    decisiones,
  };
}
