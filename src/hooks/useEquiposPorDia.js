import { useMemo } from 'react'

export function useEquiposPorDia(dias) {
  const chartData = useMemo(() => {
    if (!dias?.length) return null
    const labels = dias.map(d => `D${d.dia}`)
    return {
      labels,
      datasets: [
        {
          label: 'Servidor',
          data: dias.map(d => d.CS),
          backgroundColor: '#60a5fa',
          stack: 'eq',
          borderRadius: 2,
        },
        {
          label: 'Switch/Router',
          data: dias.map(d => d.CR),
          backgroundColor: '#c084fc',
          stack: 'eq',
          borderRadius: 2,
        },
        {
          label: 'Hogareño',
          data: dias.map(d => d.ER),
          backgroundColor: '#f59e0b',
          stack: 'eq',
          borderRadius: 2,
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
        stacked: true,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', maxRotation: 0, autoSkip: true, autoSkipPadding: 6 },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Equipos', color: '#64748b' },
      },
    },
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 11, padding: 14 } },
      tooltip: {
        callbacks: {
          footer: (items) => `Total: ${items.reduce((s, it) => s + it.parsed.y, 0)}`,
        },
      },
    },
  }), [])

  return { chartData, opciones }
}
