import { useMemo } from 'react'

export function useDonutsDestino(datos) {
  const dataTipo = useMemo(() => {
    if (!datos?.resumen) return null
    const { CS, CR, ER } = datos.resumen
    return {
      labels: ['Servidor', 'Switch/Router', 'Hogareño'],
      datasets: [{
        data: [CS, CR, ER],
        backgroundColor: ['#60a5fa', '#c084fc', '#f59e0b'],
        borderColor: '#0e1e35',
        borderWidth: 2,
        hoverOffset: 6,
      }],
    }
  }, [datos])

  const dataDestino = useMemo(() => {
    if (!datos?.resumen) return null
    const { EF, ED, EI } = datos.resumen
    return {
      labels: ['Reutilización', 'Desarme', 'Disposición'],
      datasets: [{
        data: [EF, ED, EI],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: '#0e1e35',
        borderWidth: 2,
        hoverOffset: 6,
      }],
    }
  }, [datos])

  const opciones = useMemo(() => ({
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 14, boxWidth: 11, font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = total ? (ctx.raw / total * 100).toFixed(1) : 0
            return `${ctx.label}: ${ctx.raw.toLocaleString('es-AR')} (${pct}%)`
          },
        },
      },
    },
  }), [])

  return { dataTipo, dataDestino, opciones }
}
