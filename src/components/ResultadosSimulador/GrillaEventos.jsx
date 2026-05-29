import React from 'react'
import { useGrillaEventos } from '../../hooks/useGrillaEventos'
import styles from './GrillaEventos.module.css'

const DESTINO_COLOR = { EF: '#10b981', ED: '#f59e0b', EI: '#ef4444' }

const GrillaEventos = ({ grilla, rng }) => {
  const {
    total, inicio, fin, cant, filas,
    desde, setDesde,
    cantidad, setCantidad,
    irAnterior, irSiguiente,
    fmtU, fmt2, fmtInt,
  } = useGrillaEventos(grilla)

  if (total === 0) return (
    <div className={styles.empty}>No hay datos de grilla disponibles.</div>
  )

  return (
    <div className={styles.wrapper}>
      <p className={styles.intro}>
        Vector de estado: una fila por equipo con el número aleatorio u usado en cada
        variable y el valor resultante. Total de números aleatorios consumidos:{' '}
        <strong style={{ color: 'var(--text)' }}>{fmtInt(rng?.totalUConsumidos)}</strong>.
      </p>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className="input-label">Mostrar desde fila</label>
          <input
            type="number"
            min={1}
            max={total}
            value={desde}
            onChange={e => setDesde(e.target.value)}
          />
        </div>
        <div className={styles.controlGroup}>
          <label className="input-label">Cantidad</label>
          <select value={cantidad} onChange={e => setCantidad(Number(e.target.value))}>
            {[25, 50, 100, 200].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className={styles.navGroup}>
          <button className="btn-secondary" onClick={irAnterior} disabled={inicio <= 1}>
            Anterior
          </button>
          <button className="btn-secondary" onClick={irSiguiente} disabled={fin >= total}>
            Siguiente
          </button>
          <span className={styles.pageInfo}>
            Filas {fmtInt(inicio)}–{fmtInt(fin)} de {fmtInt(total)}
          </span>
        </div>
      </div>

      <div className="sim-table-wrap" style={{ maxHeight: '55vh' }}>
        <table className="sim-table" style={{ minWidth: '1500px', fontSize: '0.74rem' }}>
          <thead>
            <tr>
              <th>#</th><th>Día</th><th>Lote</th><th>Eq.</th>
              <th>u·Tipo</th><th>Tipo</th>
              <th>u·Peso</th><th>Peso (kg)</th>
              <th>u·TR₁</th><th>u·TR₂</th><th>TR (min)</th>
              <th>u·TD</th><th>TD (min)</th>
              <th>u·Dest.</th><th>Destino</th>
              <th>u·TDD</th><th>TDD (min)</th>
              <th>u·Efic.</th><th>Resultado</th><th>Agua (L)</th>
            </tr>
          </thead>
          <tbody>
            {filas.map(f => (
              <tr key={f.idx}>
                <td className="mono" style={{ fontWeight: 600 }}>{f.idx}</td>
                <td className="mono">{f.dia}</td>
                <td className="mono">{f.lote}</td>
                <td className="mono">{f.equipoEnLote}</td>
                <td className="mono" style={{ color: 'var(--text-dim)' }}>{fmtU(f.uTipo)}</td>
                <td className="mono">{f.tipoLabel}</td>
                <td className="mono" style={{ color: 'var(--text-dim)' }}>{fmtU(f.uPeso)}</td>
                <td className="mono">{fmt2(f.peso)}</td>
                <td className="mono" style={{ color: 'var(--text-dim)' }}>{fmtU(f.uTR1)}</td>
                <td className="mono" style={{ color: 'var(--text-dim)' }}>{fmtU(f.uTR2)}</td>
                <td className="mono">{fmt2(f.tr)}</td>
                <td className="mono" style={{ color: 'var(--text-dim)' }}>{fmtU(f.uTD)}</td>
                <td className="mono">{fmt2(f.td)}</td>
                <td className="mono" style={{ color: 'var(--text-dim)' }}>{fmtU(f.uDestino)}</td>
                <td className="mono" style={{ color: DESTINO_COLOR[f.destino], fontWeight: 600 }}>
                  {f.destinoLabel}
                </td>
                <td className="mono" style={{ color: 'var(--text-dim)' }}>
                  {f.uTDD != null ? fmtU(f.uTDD) : '—'}
                </td>
                <td className="mono">{f.tdd != null ? fmt2(f.tdd) : '—'}</td>
                <td className="mono" style={{ color: 'var(--text-dim)' }}>{fmtU(f.uEficacia)}</td>
                <td className="mono">
                  <span className={f.ok ? styles.badgeOk : styles.badgeIncid}>
                    {f.ok ? 'OK' : 'Incidente'}
                  </span>
                </td>
                <td className="mono">{f.agua === 0 ? '—' : fmtInt(f.agua)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GrillaEventos
