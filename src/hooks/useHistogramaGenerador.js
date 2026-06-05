import { useMemo } from 'react'

function fmtNum(n, dec = 0) {
  return typeof n === 'number'
    ? n.toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec })
    : '—'
}

export function useHistogramaGenerador(grilla) {
  const stats = useMemo(() => {
    if (!grilla?.length) return null

    const us = []
    for (const r of grilla) {
      us.push(r.uTipo, r.uPeso, r.uTR1, r.uTR2, r.uTD, r.uDestino, r.uEficacia)
      if (r.uTDD != null) us.push(r.uTDD)
    }

    const n = us.length
    if (n === 0) return null

    const bins = new Array(10).fill(0)
    let sum = 0
    let min = 1
    let max = 0

    for (const u of us) {
      const i = Math.min(9, Math.floor(u * 10))
      bins[i] += 1
      sum += u
      if (u < min) min = u
      if (u > max) max = u
    }

    const esperado = n / 10
    const desviacionMax = Math.max(...bins.map(b => Math.abs(b - esperado)))

    return {
      bins,
      n,
      mean: sum / n,
      min,
      max,
      esperado,
      desviacionMax,
    }
  }, [grilla])

  const chartData = useMemo(() => {
    if (!stats) return null
    const labels = [
      '0.0–0.1','0.1–0.2','0.2–0.3','0.3–0.4','0.4–0.5',
      '0.5–0.6','0.6–0.7','0.7–0.8','0.8–0.9','0.9–1.0',
    ]
    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Frecuencia observada',
          data: stats.bins,
          backgroundColor: 'rgba(52,211,153,0.75)',
          borderColor: '#34d399',
          borderWidth: 1,
          borderRadius: 4,
          order: 2,
        },
        {
          type: 'line',
          label: `Frec. esperada (uniforme: ${Math.round(stats.esperado)})`,
          data: new Array(10).fill(stats.esperado),
          borderColor: '#fbbf24',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          tension: 0,
          fill: false,
          order: 1,
        },
      ],
    }
  }, [stats])

  const opciones = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', maxRotation: 30 },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Cantidad de u', color: '#64748b' },
      },
    },
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 11, padding: 14 } },
    },
  }), [])

  const statRows = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'Cantidad (n)',            value: fmtNum(stats.n) },
      { label: 'Media muestral',          value: fmtNum(stats.mean, 4) },
      { label: 'Media esperada',          value: '0,5000' },
      { label: 'Mínimo observado',        value: fmtNum(stats.min, 4) },
      { label: 'Máximo observado',        value: fmtNum(stats.max, 4) },
      { label: 'Frec. esperada / decil',  value: fmtNum(stats.esperado, 1) },
      { label: 'Desvío máx. vs esperado', value: fmtNum(stats.desviacionMax) },
    ]
  }, [stats])

  return { stats, chartData, opciones, statRows }
}
