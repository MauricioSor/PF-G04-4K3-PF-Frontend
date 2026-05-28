import { describe, it, expect } from 'vitest';
import { runSimulacion } from '../simulation.js';

describe('runSimulacion', () => {
  it('es determinista: misma config => resultado idéntico', () => {
    const a = runSimulacion({ semilla: 2000 });
    const b = runSimulacion({ semilla: 2000 });
    expect(a.resumen).toEqual(b.resumen);
    expect(a.decisiones).toEqual(b.decisiones);
    expect(a.grilla).toEqual(b.grilla);
    expect(a.diario).toEqual(b.diario);
  });

  it('semillas distintas => resultados distintos', () => {
    const a = runSimulacion({ semilla: 2000 });
    const b = runSimulacion({ semilla: 9999 });
    expect(a.resumen.tep).not.toBe(b.resumen.tep);
  });

  it('cumple los invariantes del modelo', () => {
    const { resumen, grilla, diario } = runSimulacion({ semilla: 2000 });

    expect(resumen.tep).toBe(resumen.cs + resumen.cr + resumen.er);
    expect(resumen.tt).toBeCloseTo(resumen.ttd + resumen.ttdd, 6);
    expect(resumen.ef + resumen.ed + resumen.ei).toBe(resumen.tep);
    expect(grilla.length).toBe(resumen.tep);

    const eqDiario = diario.reduce((s, d) => s + d.equipos, 0);
    expect(eqDiario).toBe(resumen.tep);
    expect(diario).toHaveLength(30);

    const lotesDiario = diario.reduce((s, d) => s + d.lotes, 0);
    expect(lotesDiario).toBe(resumen.totalLotes);

    // El agua total y el peso total coinciden con la suma de la grilla.
    const aguaGrilla = grilla.reduce((s, row) => s + row.agua, 0);
    expect(aguaGrilla).toBeCloseTo(resumen.ta, 4);
    const pesoGrilla = grilla.reduce((s, row) => s + row.peso, 0);
    expect(pesoGrilla).toBeCloseTo(resumen.pt, 4);

    // PE = equipos OK? incidentes = equipos con !ok
    const incidentes = grilla.filter((row) => !row.ok).length;
    expect(incidentes).toBe(resumen.pe);

    // tdd solo existe cuando el destino es desarme (ED)
    const conTdd = grilla.filter((row) => row.tdd !== null).length;
    expect(conTdd).toBe(resumen.ed);
  });

  it('la decisión usa > (no >=) en el umbral exacto de TEP', () => {
    const base = runSimulacion({ semilla: 2000 });
    const tep = base.resumen.tep;

    const enUmbral = runSimulacion({ semilla: 2000, umbralTEP: tep });
    const bajoUmbral = runSimulacion({ semilla: 2000, umbralTEP: tep - 1 });

    expect(enUmbral.decisiones.find((d) => d.clave === 'segundoTurno').cumple).toBe(false);
    expect(bajoUmbral.decisiones.find((d) => d.clave === 'segundoTurno').cumple).toBe(true);
  });

  it('la decisión de operario compara TT en horas contra el umbral', () => {
    const base = runSimulacion({ semilla: 2000 });
    const ttH = base.resumen.ttHoras;

    const enUmbral = runSimulacion({ semilla: 2000, umbralTT: ttH });
    const bajoUmbral = runSimulacion({ semilla: 2000, umbralTT: ttH - 0.001 });

    expect(enUmbral.decisiones.find((d) => d.clave === 'operario').cumple).toBe(false);
    expect(bajoUmbral.decisiones.find((d) => d.clave === 'operario').cumple).toBe(true);
  });

  it('respeta opts.collectGrid=false (no arma la grilla)', () => {
    const { grilla, resumen } = runSimulacion({ semilla: 2000 }, { collectGrid: false });
    expect(grilla).toHaveLength(0);
    expect(resumen.tep).toBeGreaterThan(0);
  });
});
