import React from 'react'
import styles from './ResultadosSimulador.module.css'
import { useResultados } from '../../hooks/useResultados'
import GaugeChart from './GaugeChart'
import ChartArea  from './ChartArea'

import {
  Truck, Scale, Droplets,
  Recycle, Wrench, Trash2,
  Server, Network, Laptop,
  CheckCircle, AlertTriangle,
  BarChart3, Package, ListOrdered,
  RefreshCcw, Play, Star,
} from 'lucide-react'

const LIcon = ({ icon: Icon, size = 14, color = 'currentColor', style = {} }) => (
  <Icon size={size} color={color} style={{ flexShrink: 0, ...style }} />
)

const ResultadosSimulador = ({ datos, onEjecutar, onReiniciar }) => {
  const {
    tablaVisible, setTablaVisible,
    fmt,
    cumulTTR_hs, cumulTT_hs,
    pctOk, pctIncid,
  } = useResultados(datos)

  if (!datos) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div className="page-header">
          <div className="breadcrumb">
            <span>Inicio</span><span>›</span>
            <span style={{ color: 'var(--text)' }}>Resultados</span>
          </div>
          <h1 className="page-title">Tablero de Análisis de Resultados</h1>
        </div>
        <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty-state">
            <div className="empty-state-icon">
              <BarChart3 size={48} color="rgba(255,255,255,0.2)" />
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>No hay resultados disponibles</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Ejecutá la simulación desde la sección Configuración</div>
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={onEjecutar}>
              Ir a Configuración
            </button>
          </div>
        </div>
        <div className="page-footer">
          <button className="btn-secondary" onClick={onReiniciar}>
            <RefreshCcw size={14} /> Reiniciar
          </button>
          <button className="btn-primary" onClick={onEjecutar}>
            <Play size={12} fill="#07111f" /> Ejecutar Simulación
          </button>
        </div>
      </div>
    )
  }

  const { dias, resumen, decisiones, methodName, seed, seedWasRandom } = datos

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* ── Encabezado ── */}
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div className="breadcrumb">
          <span>Inicio</span><span>›</span>
          <span style={{ color: 'var(--text)' }}>Resultados</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Tablero de Análisis de Resultados</h1>
          {/* Badge: método + semilla */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            gap:          8,
            background:   'rgba(255,255,255,0.05)',
            border:       '1px solid var(--border)',
            borderRadius: 999,
            padding:      '4px 12px 4px 8px',
            fontSize:     '0.72rem',
            flexShrink:   0,
          }}>
            <span style={{
              background:   'rgba(168,85,247,0.15)',
              color:        '#c084fc',
              borderRadius: 999,
              padding:      '2px 8px',
              fontWeight:   600,
              fontSize:     '0.68rem',
            }}>{methodName}</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {seedWasRandom ? 'Semilla aleatoria:' : 'Semilla:'}
            </span>
            <span style={{
              fontFamily:  'monospace',
              fontWeight:  700,
              color:       seedWasRandom ? '#f59e0b' : 'var(--teal)',
              letterSpacing: '0.04em',
            }}>{seed}</span>
          </div>
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div className="page-body fade-in">

        {/* Grid 2×2 */}
        <div className={styles.resultsGrid} style={{ marginBottom: 16 }}>

          {/* ── Resumen de Simulación ── */}
          <div className="card">
            <div className="card-title">
              <div className="card-title-icon" style={{ background: 'rgba(0,212,200,0.12)' }}>
                <ListOrdered size={14} color="#00d4c8" />
              </div>
              Resumen de Simulación
            </div>

            <div className={styles.kpiRow}>
              {[
                { Icon: Truck,    label: 'Total Equipos:', val: fmt(resumen.TEP), color: 'var(--teal)' },
                { Icon: Scale,    label: 'Peso Total:',    val: `${(resumen.PT / 1000).toFixed(1)} Ton`, color: '#f59e0b' },
                { Icon: Droplets, label: 'Agua Evitada:',  val: `${(resumen.TA / 1000).toFixed(0)}K L`, color: '#3b82f6' },
              ].map(({ Icon, label, val, color }) => (
                <div key={label} className={styles.kpiItem}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div className={styles.kpiLabel}>{label}</div>
                  <div className={styles.kpiValue} style={{ color }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
              {[
                { l: 'Funcionales (EF)', v: fmt(resumen.EF), c: '#10b981' },
                { l: 'Desarme (ED)',     v: fmt(resumen.ED), c: '#f59e0b' },
                { l: 'Desecho (EI)',     v: fmt(resumen.EI), c: '#ef4444' },
              ].map(({ l, v, c }) => (
                <div key={l} className="card-inner" style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Eficacia Operativa ── */}
          <div className="card">
            <div className="card-title">
              <div className="card-title-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                <CheckCircle size={14} color="#3b82f6" />
              </div>
              Eficacia Operativa
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '8px 0 4px' }}>
              <GaugeChart pct={pctOk}    color="#00d4c8" label="Correcto" />
              <GaugeChart pct={pctIncid} color="#f59e0b" label="Incidentes" />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <div className="stat-kpi">
                <div className="stat-kpi-val" style={{ color: '#00d4c8', fontSize: '1rem' }}>{fmt(resumen.TTR_hs, 1)} hs</div>
                <div className="stat-kpi-label">Tiempo Total Recepción</div>
              </div>
              <div className="stat-kpi">
                <div className="stat-kpi-val" style={{ color: '#f59e0b', fontSize: '1rem' }}>{fmt(resumen.TT_hs, 1)} hs</div>
                <div className="stat-kpi-label">Tiempo Total Operación</div>
              </div>
            </div>
          </div>

          {/* ── Análisis de Tiempos ── */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 440 }}>
            <div className="card-title" style={{ flexShrink: 0 }}>
              <div className="card-title-icon" style={{ background: 'rgba(16,185,129,0.12)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
              </div>
              Análisis de Tiempos
            </div>

            <div style={{ flex: 1, minHeight: 280, display: 'flex', gap: 12, margin: '8px 0' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
                <ChartArea data={cumulTTR_hs} color="#00d4c8" title="TTR Acumulado (hs)" gradientId="gradTTR" />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
                <ChartArea data={cumulTT_hs}  color="#f59e0b" title="TT Acumulado (hs)"  gradientId="gradTT"  />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
              <div className="stat-kpi">
                <div className="stat-kpi-val" style={{ color: '#00d4c8', fontSize: '0.95rem' }}>
                  {fmt(Math.max(...dias.map(d => d.lotes)))}
                </div>
                <div className="stat-kpi-label">Máx. lotes/día</div>
              </div>
              <div className="stat-kpi">
                <div className="stat-kpi-val" style={{ color: '#f59e0b', fontSize: '0.95rem' }}>
                  {fmt(resumen.TEP / 30, 1)}
                </div>
                <div className="stat-kpi-label">Prom. equipos/día</div>
              </div>
              <div className="stat-kpi">
                <div className="stat-kpi-val" style={{ color: '#ef4444', fontSize: '0.95rem' }}>
                  {fmt(resumen.PE)}
                </div>
                <div className="stat-kpi-label">Incidentes totales</div>
              </div>
            </div>
          </div>

          {/* ── Decisiones Recomendadas ── */}
          <div className="card">
            <div className="card-title">
              <div className="card-title-icon" style={{ background: 'rgba(168,85,247,0.12)' }}>
                <Star size={14} color="#a855f7" />
              </div>
              Decisiones Recomendadas
            </div>

            {[
              {
                label:  'Invertir en Recepción (TTR > 160 hs)',
                detail: `TTR = ${fmt(resumen.TTR_hs, 1)} hs`,
                activa: decisiones.nuevoRecepcionista,
              },
              {
                label:  'Reforzar Operarios (TT > 160 hs)',
                detail: `TT = ${fmt(resumen.TT_hs, 1)} hs`,
                activa: decisiones.nuevoOperario,
              },
              {
                label:  '2do Turno (TEP > 800 eq.)',
                detail: `TEP = ${fmt(resumen.TEP)} equipos`,
                activa: decisiones.segundoTurno,
              },
            ].map(({ label, detail, activa }) => (
              <div
                key={label}
                className={`${styles.decisionItem} ${activa ? styles.decisionActive : styles.decisionInactive}`}
              >
                <div className={styles.decisionPlay}
                  style={{ background: activa ? 'var(--teal)' : 'rgba(255,255,255,0.08)' }}>
                  <Play size={7} fill={activa ? '#07111f' : 'rgba(255,255,255,0.4)'} color="transparent" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.7, marginTop: 1 }}>{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabla día a día ── */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tablaVisible ? 14 : 0 }}>
            <div className="card-title" style={{ margin: 0 }}>
              <div className="card-title-icon" style={{ background: 'rgba(0,212,200,0.08)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4c8" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
              </div>
              Tabla de Resultados Diarios (30 días)
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              onClick={() => setTablaVisible(v => !v)}
            >
              {tablaVisible ? '▲ Ocultar' : '▼ Ver tabla'}
            </button>
          </div>

          {tablaVisible && (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                {[
                  { l: 'Días con incidente', v: dias.filter(d => d.PE > 0).length,              c: '#ef4444' },
                  { l: 'Máx. equipos/día',   v: fmt(Math.max(...dias.map(d => d.equipos))),     c: 'var(--teal)' },
                  { l: 'Máx. TA/día',        v: fmt(Math.max(...dias.map(d => d.TA))) + ' L',   c: '#3b82f6' },
                  { l: 'Máx. peso/día',      v: fmt(Math.max(...dias.map(d => d.PT)), 1) + ' kg', c: '#f59e0b' },
                ].map(({ l, v, c }) => (
                  <div key={l} className="card-inner" style={{ padding: '8px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l}:</span>
                    <span style={{ fontWeight: 700, color: c, fontSize: '0.88rem' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="sim-table-wrap">
                <table className="sim-table">
                  <thead>
                    <tr>
                      <th>Día</th><th>Lotes</th><th>Total Eq.</th>
                      <th style={{ color: '#8b5cf6' }}>Serv.</th>
                      <th style={{ color: '#3b82f6' }}>Switch</th>
                      <th style={{ color: '#f59e0b' }}>Hog.</th>
                      <th>PT (kg)</th>
                      <th style={{ color: '#10b981' }}>EF</th>
                      <th style={{ color: '#f59e0b' }}>ED</th>
                      <th style={{ color: '#ef4444' }}>EI</th>
                      <th>Incid.</th>
                      <th style={{ color: '#3b82f6' }}>TA (L)</th>
                      <th>TTR (m)</th><th>TT (m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dias.map((d) => (
                      <tr key={d.dia} className={d.PE > 0 ? 'row-incident' : ''}>
                        <td className="mono" style={{ color: 'var(--teal)', fontWeight: 600 }}>D{d.dia}</td>
                        <td className="mono">{d.lotes}</td>
                        <td className="mono" style={{ fontWeight: 600 }}>{d.equipos}</td>
                        <td className="mono" style={{ color: '#8b5cf6' }}>{d.CS}</td>
                        <td className="mono" style={{ color: '#3b82f6' }}>{d.CR}</td>
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
                      <td className="mono">{fmt(dias.reduce((s, d) => s + d.lotes, 0))}</td>
                      <td className="mono">{fmt(resumen.TEP)}</td>
                      <td className="mono" style={{ color: '#8b5cf6' }}>{fmt(resumen.CS)}</td>
                      <td className="mono" style={{ color: '#3b82f6' }}>{fmt(resumen.CR)}</td>
                      <td className="mono" style={{ color: '#f59e0b' }}>{fmt(resumen.ER)}</td>
                      <td className="mono">{fmt(resumen.PT, 1)}</td>
                      <td className="mono" style={{ color: '#10b981' }}>{fmt(resumen.EF)}</td>
                      <td className="mono" style={{ color: '#f59e0b' }}>{fmt(resumen.ED)}</td>
                      <td className="mono" style={{ color: '#ef4444' }}>{fmt(resumen.EI)}</td>
                      <td className="mono" style={{ color: resumen.PE > 0 ? '#ef4444' : 'var(--teal)' }}>{fmt(resumen.PE)}</td>
                      <td className="mono" style={{ color: '#3b82f6' }}>{fmt(resumen.TA)}</td>
                      <td className="mono">{fmt(resumen.TTR, 1)}</td>
                      <td className="mono">{fmt(resumen.TT, 1)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="page-footer" style={{ flexShrink: 0 }}>
        <button className="btn-secondary" onClick={onReiniciar}>
          <RefreshCcw size={14} /> Reiniciar
        </button>
        <button className="btn-primary" onClick={onEjecutar}>
          <Play size={12} fill="#07111f" color="transparent" /> Ejecutar Simulación
        </button>
      </div>
    </div>
  )
}

export default ResultadosSimulador
