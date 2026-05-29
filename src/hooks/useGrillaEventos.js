import { useState, useMemo } from 'react'

export function useGrillaEventos(grilla) {
  const total = grilla?.length ?? 0
  const [desde, setDesde] = useState(1)
  const [cantidad, setCantidad] = useState(50)

  const inicio = Math.min(Math.max(1, Number(desde) || 1), Math.max(total, 1))
  const cant   = Math.max(1, Number(cantidad) || 50)
  const fin    = Math.min(inicio - 1 + cant, total)

  const filas = useMemo(
    () => (grilla ?? []).slice(inicio - 1, fin),
    [grilla, inicio, fin]
  )

  const irAnterior  = () => setDesde(Math.max(1, inicio - cant))
  const irSiguiente = () => setDesde(fin + 1 <= total ? fin + 1 : inicio)

  const fmtU = (v) => (v != null ? v.toFixed(4) : '—')
  const fmt2 = (v) => (v != null ? v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—')
  const fmtInt = (v) => (typeof v === 'number' ? v.toLocaleString('es-AR') : '—')

  return {
    total, inicio, fin, cant, filas,
    desde, setDesde,
    cantidad, setCantidad,
    irAnterior, irSiguiente,
    fmtU, fmt2, fmtInt,
  }
}
