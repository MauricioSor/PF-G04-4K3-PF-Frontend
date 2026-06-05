import { useMemo } from 'react'

export function useAcumuladoMensual(dias) {
  const chartData = useMemo(() => {
    if (!dias?.length) return null
    let tepAcum = 0
    let aguaAcum = 0
    const labels = []
    const tep = []
    const agua = []
    for (const d of dias) {
      tepAcum += d.equipos
      aguaAcum += d.TA
      labels.push(`D${d.dia}`)
      tep.push(tepAcum)
      agua.push(aguaAcum)
    }
    return {
      labels,
      datasets: [
        {
          label: 'TEP acumulado',
          data: tep,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.12)',
          yAxisID: 'y1',
          tension: 0.3,
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 5,
        },
        {
          label: 'Agua no contaminada (L)',
          data: agua,
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34,211,238,0.06)',
          yAxisID: 'y2',
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 5,
        },
      ],
    }
  }, [dias])

  const opciones = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', maxRotation: 0, autoSkip: true, autoSkipPadding: 4 },
      },
      y1: {
        position: 'left',
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#10b981' },
        title: { display: true, text: 'Equipos (TEP)', color: '#10b981' },
      },
      y2: {
        position: 'right',
        grid: { display: false },
        ticks: {
          color: '#22d3ee',
          callback: (v) => `${(v / 1_000_000).toFixed(1)}M`,
        },
        title: { display: true, text: 'Litros', color: '#22d3ee' },
      },
    },
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 11, padding: 14 } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y.toLocaleString('es-AR')
            const unidad = ctx.dataset.yAxisID === 'y2' ? 'L' : 'eq.'
            return `${ctx.dataset.label}: ${v} ${unidad}`
          },
        },
      },
    },
  }), [])

  return { chartData, opciones }
}
