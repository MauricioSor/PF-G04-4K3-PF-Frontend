import { useState, useMemo } from 'react'

export function useResultados(datos) {
  const [tablaVisible, setTablaVisible] = useState(false)

  const fmt = (n, dec = 0) =>
    typeof n === 'number'
      ? n.toLocaleString('es-AR', {
          minimumFractionDigits: dec,
          maximumFractionDigits: dec,
        })
      : '—'

  /** Series acumulativas para el AreaChart (TTR y TT en horas) */
  const { cumulTTR_hs, cumulTT_hs } = useMemo(() => {
    if (!datos?.dias) return { cumulTTR_hs: [], cumulTT_hs: [] }
    let sumTTR = 0
    let sumTT  = 0
    const cumulTTR_hs = datos.dias.map(d => {
      sumTTR += d.TTR
      return +(sumTTR / 60).toFixed(2)
    })
    const cumulTT_hs = datos.dias.map(d => {
      sumTT += d.TT
      return +(sumTT / 60).toFixed(2)
    })
    return { cumulTTR_hs, cumulTT_hs }
  }, [datos])

  /** Porcentaje de procesamiento correcto vs incidentes */
  const pctOk = datos
    ? 100 * (datos.resumen.TEP - datos.resumen.PE) / Math.max(datos.resumen.TEP, 1)
    : 0

  const pctIncid = datos
    ? 100 * datos.resumen.PE / Math.max(datos.resumen.TEP, 1)
    : 0

  return {
    tablaVisible,
    setTablaVisible,
    fmt,
    cumulTTR_hs,
    cumulTT_hs,
    pctOk,
    pctIncid,
  }
}
