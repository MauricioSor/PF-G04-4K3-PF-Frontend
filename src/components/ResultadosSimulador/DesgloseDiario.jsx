import React from 'react'
import { useDesgloseDiario } from '../../hooks/useDesgloseDiario'
import EquiposPorDia from './EquiposPorDia'
import styles from './DesgloseDiario.module.css'

const DesgloseDiario = ({ dias }) => {
  const { totales, fmt } = useDesgloseDiario(dias)

  if (!dias?.length || !totales) return null

  return (
    <div className={styles.wrapper}>
      <p className={styles.intro}>
        Detalle por jornada — cada fila es un día de operación de 8 horas.
      </p>

      <div className={styles.chartArea}>
        <EquiposPorDia dias={dias} />
      </div>

      <div className="sim-table-wrap" style={{ maxHeight: '420px' }}>
        <table className="sim-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Lotes</th>
              <th>Equipos</th>
              <th style={{ color: '#60a5fa' }}>Serv.</th>
              <th style={{ color: '#c084fc' }}>Switch</th>
              <th style={{ color: '#f59e0b' }}>Hogar.</th>
              <th>PT (kg)</th>
              <th style={{ color: '#10b981' }}>EF</th>
              <th style={{ color: '#f59e0b' }}>ED</th>
              <th style={{ color: '#ef4444' }}>EI</th>
              <th>Incid.</th>
              <th style={{ color: '#3b82f6' }}>TA (L)</th>
              <th>TTR (m)</th>
              <th>TT (m)</th>
            </tr>
          </thead>
          <tbody>
            {dias.map(d => (
              <tr key={d.dia} className={d.PE > 0 ? 'row-incident' : ''}>
                <td className="mono" style={{ color: 'var(--teal)', fontWeight: 600 }}>D{d.dia}</td>
                <td className="mono">{d.lotes}</td>
                <td className="mono" style={{ fontWeight: 600 }}>{d.equipos}</td>
                <td className="mono" style={{ color: '#60a5fa' }}>{d.CS}</td>
                <td className="mono" style={{ color: '#c084fc' }}>{d.CR}</td>
                <td className="mono" style={{ color: '#f59e0b' }}>{d.ER}</td>
                <td className="mono">{fmt(d.PT, 1)}</td>
                <td className="mono" style={{ color: '#10b981' }}>{d.EF}</td>
                <td className="mono" style={{ color: '#f59e0b' }}>{d.ED}</td>
                <td className="mono" style={{ color: '#ef4444' }}>{d.EI}</td>
                <td className="mono" style={{ color: d.PE > 0 ? '#ef4444' : 'var(--text-dim)', fontWeight: d.PE > 0 ? 700 : 400 }}>
                  {d.PE > 0 ? d.PE : '—'}
                </td>
                <td className="mono" style={{ color: '#3b82f6' }}>{fmt(d.TA)}</td>
                <td className="mono">{fmt(d.TTR, 1)}</td>
                <td className="mono">{fmt(d.TT, 1)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ color: 'var(--teal)', fontWeight: 700 }}>TOTAL</td>
              <td className="mono">{fmt(totales.lotes)}</td>
              <td className="mono">{fmt(totales.equipos)}</td>
              <td className="mono" style={{ color: '#60a5fa' }}>{fmt(totales.CS)}</td>
              <td className="mono" style={{ color: '#c084fc' }}>{fmt(totales.CR)}</td>
              <td className="mono" style={{ color: '#f59e0b' }}>{fmt(totales.ER)}</td>
              <td className="mono">{fmt(totales.PT, 1)}</td>
              <td className="mono" style={{ color: '#10b981' }}>{fmt(totales.EF)}</td>
              <td className="mono" style={{ color: '#f59e0b' }}>{fmt(totales.ED)}</td>
              <td className="mono" style={{ color: '#ef4444' }}>{fmt(totales.EI)}</td>
              <td className="mono" style={{ color: totales.PE > 0 ? '#ef4444' : 'var(--teal)' }}>{fmt(totales.PE)}</td>
              <td className="mono" style={{ color: '#3b82f6' }}>{fmt(totales.TA)}</td>
              <td className="mono">{fmt(totales.TTR, 1)}</td>
              <td className="mono">{fmt(totales.TT, 1)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default DesgloseDiario
