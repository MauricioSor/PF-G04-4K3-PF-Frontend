import { useState, useCallback } from 'react';
import { runSimulacion } from '../engine/simulation.js';

// Hook que orquesta la ejecución del motor desde la UI.
// estado: 'idle' (sin correr) | 'running' (calculando) | 'done' | 'error'.
// El cálculo se difiere con setTimeout(...,0) para que el spinner alcance a pintarse
// antes de la corrida síncrona (~1800 equipos, sub-milisegundo igualmente).
export function useSimulacion() {
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState('idle');
  const [error, setError] = useState(null);

  const ejecutar = useCallback((config) => {
    setEstado('running');
    setError(null);
    setTimeout(() => {
      try {
        const r = runSimulacion(config, { collectGrid: true });
        setResultado(r);
        setEstado('done');
      } catch (e) {
        setError(e);
        setEstado('error');
      }
    }, 0);
  }, []);

  const reiniciar = useCallback(() => {
    setResultado(null);
    setEstado('idle');
    setError(null);
  }, []);

  return { resultado, estado, error, ejecutar, reiniciar };
}
