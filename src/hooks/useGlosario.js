import { useMemo } from 'react'

const GRUPOS = [
  {
    titulo: 'Control de la simulación',
    color: '#00d4c8',
    items: [
      ['d',   'Día simulado (1 a 30)'],
      ['u',   'Número aleatorio uniforme (0 ≤ u < 1)'],
      ['L',   'Cantidad de lotes que llegan en el día'],
      ['CE',  'Cantidad de equipos por lote'],
    ],
  },
  {
    titulo: 'Tipos de equipo',
    color: '#60a5fa',
    items: [
      ['Tipo 1', 'Servidor (Rack/Blade)'],
      ['Tipo 2', 'Switch / Router Industrial'],
      ['Tipo 3', 'Equipo de red hogareño'],
      ['CS',     'Cantidad de servidores procesados'],
      ['CR',     'Cantidad de switch/routers procesados'],
      ['ER',     'Cantidad de equipos hogareños procesados'],
    ],
  },
  {
    titulo: 'Pesos (kg)',
    color: '#c084fc',
    items: [
      ['PS',  'Peso del servidor — Uniforme(15, 30) → 15 + 15·u'],
      ['PR',  'Peso del switch/router — Uniforme(3, 8) → 3 + 5·u'],
      ['PER', 'Peso del equipo hogareño — Normal(μ=0.5, σ=0.2) [Box-Muller, 2 u\'s]'],
      ['PT',  'Peso total procesado en el período'],
    ],
  },
  {
    titulo: 'Tiempos (minutos)',
    color: '#f59e0b',
    items: [
      ['TR',   'Tiempo de recepción de un equipo — Normal(μ=2, σ=0.5)'],
      ['TD',   'Tiempo de diagnóstico — Uniforme(3, 12) → 3 + 9·u'],
      ['TDD',  'Tiempo de desarme — Uniforme(5, 55) → 5 + 50·u'],
      ['TTR',  'Tiempo total de recepción acumulado'],
      ['TTD',  'Tiempo total de diagnóstico acumulado'],
      ['TTDD', 'Tiempo total de desarme acumulado'],
      ['TT',   'Tiempo total operativo (TTD + TTDD)'],
    ],
  },
  {
    titulo: 'Destino del diagnóstico',
    color: '#fb7185',
    items: [
      ['EF', 'Equipos funcionales — se reutilizan (10% del flujo)'],
      ['ED', 'Equipos para desarme (75% del flujo)'],
      ['EI', 'Equipos irrecuperables — disposición final (15% del flujo)'],
    ],
  },
  {
    titulo: 'Calidad e impacto ambiental',
    color: '#22d3ee',
    items: [
      ['PC',  'Equipos procesados correctamente (sin incidente)'],
      ['PE',  'Incidentes de contaminación (0.95% del flujo)'],
      ['TA',  'Litros de agua no contaminada (impacto evitado)'],
      ['TEP', 'Total de equipos procesados en el período'],
    ],
  },
  {
    titulo: 'Umbrales de decisión',
    color: '#a78bfa',
    items: [
      ['TTR > 160 hs', 'Incorporar nuevo recepcionista'],
      ['TT > 160 hs',  'Incorporar nuevo operario'],
      ['TEP > 800 eq', 'Habilitar segundo turno o convenio'],
    ],
  },
]

export function useGlosario() {
  const grupos = useMemo(() => GRUPOS, [])
  return { grupos }
}
