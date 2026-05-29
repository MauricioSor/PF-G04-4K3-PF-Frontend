import { useMemo } from 'react'

export function useDesgloseDiario(dias) {
  const totales = useMemo(() => {
    if (!dias?.length) return null
    return dias.reduce((acc, d) => ({
      lotes:   acc.lotes   + d.lotes,
      equipos: acc.equipos + d.equipos,
      CS:      acc.CS      + d.CS,
      CR:      acc.CR      + d.CR,
      ER:      acc.ER      + d.ER,
      PT:      acc.PT      + d.PT,
      EF:      acc.EF      + d.EF,
      ED:      acc.ED      + d.ED,
      EI:      acc.EI      + d.EI,
      PE:      acc.PE      + d.PE,
      TA:      acc.TA      + d.TA,
      TTR:     acc.TTR     + d.TTR,
      TT:      acc.TT      + d.TT,
    }), { lotes:0, equipos:0, CS:0, CR:0, ER:0, PT:0, EF:0, ED:0, EI:0, PE:0, TA:0, TTR:0, TT:0 })
  }, [dias])

  const fmt = (n, dec = 0) =>
    typeof n === 'number'
      ? n.toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec })
      : '—'

  return { totales, fmt }
}
