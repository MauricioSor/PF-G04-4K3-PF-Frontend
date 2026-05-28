import React from 'react'
import styles from './Modelo.module.css'

const IconTruck = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

const IconQueue = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2"  y="7"  width="4" height="10" rx="1"/>
    <rect x="7"  y="5"  width="4" height="12" rx="1"/>
    <rect x="12" y="9"  width="4" height="8"  rx="1"/>
    <rect x="17" y="11" width="4" height="6"  rx="1"/>
  </svg>
)

const IconDesk = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="6" r="3"/><path d="M6 20v-2a6 6 0 1112 0v2"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)

const IconGear = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)

const IconCheck = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9,12 11,14 15,10"/>
  </svg>
)

const Arrow = () => (
  <div className={styles.flowArrow}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M4 18 L28 18 M22 10 L30 18 L22 26" stroke="#00d4c8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)

const FlowNode = ({ icon, title, stats, dotColor = 'dot-green', iconColor = '#5ac8fa' }) => (
  <div className={styles.flowNode}>
    <div className={`status-dot ${dotColor} ${styles.flowNodeDot}`} />
    <div className={styles.flowNodeIcon} style={{ color: iconColor }}>{icon}</div>
    <div className={styles.flowNodeTitle}>{title}</div>
    {stats.map(([label, val, color], i) => (
      <div key={i} className={styles.flowNodeStat}>
        <span className={styles.flowNodeStatLabel}>{label}</span>
        <span className={styles.flowNodeStatVal} style={color ? { color } : {}}>
          {val}
        </span>
      </div>
    ))}
  </div>
)

const NODES = [
  {
    icon: <IconTruck />, title: 'Llegadas',
    dotColor: 'dot-green', iconColor: '#5ac8fa',
    stats: [['Inter-arribo:', 'Exp(80m)'], ['Lotes/día:', '~6']],
  },
  {
    icon: <IconQueue />, title: 'Cola Recepción',
    dotColor: 'dot-green', iconColor: '#5ac8fa',
    stats: [['Disciplina:', 'FIFO'], ['Servidores:', '1']],
  },
  {
    icon: <IconDesk />, title: 'Recepción',
    dotColor: 'dot-green', iconColor: '#5ac8fa',
    stats: [['T. Servicio:', 'N(2, 0.5)'], ['Eficacia:', '99.05%']],
  },
  {
    icon: <IconQueue />, title: 'Cola Diagnóstico',
    dotColor: 'dot-orange', iconColor: '#f59e0b',
    stats: [['Disciplina:', 'FIFO'], ['Servidores:', '1']],
  },
  {
    icon: <IconGear />, title: 'Diagnóstico/Desarme',
    dotColor: 'dot-orange', iconColor: '#f59e0b',
    stats: [['Diag.:', 'U(3–15m)'], ['Desarme:', 'U(5–60m)']],
  },
  {
    icon: <IconCheck />, title: 'Completados',
    dotColor: 'dot-green', iconColor: '#00d4c8',
    stats: [['Funcional:', '10%'], ['Desarme/Dispos.:', '90%']],
  },
]

/* ── Distribuciones de probabilidad ── */
const DISTRIBUCIONES = [
  { n: '1', var: 'Tiempo entre arribosdel lotes', dist: 'Exponencial',     formula: 'T = −80 · ln(u)' },
  { n: '2', var: 'Equipos por lote',              dist: 'Uniforme Entera', formula: 'CE = INT[5 + 10u]' },
  { n: '3', var: 'Tipo de dispositivo',           dist: 'Binomial (tabla)', formula: 'Serv ≤ 0.25 / Sw ≤ 0.70' },
  { n: '4', var: 'Peso del dispositivo',          dist: 'Uniforme',        formula: 'P = 0.5 + 19.5u' },
  { n: '5', var: 'Tiempo de recepción',           dist: 'Normal',          formula: 'Normal(μ=2, σ=0.5)' },
  { n: '6', var: 'Destino del equipo',            dist: 'Binomial (tabla)', formula: 'EF ≤ 0.10 / ED ≤ 0.85' },
  { n: '7', var: 'Tiempo de diagnóstico',         dist: 'Uniforme',        formula: 'TD = 3 + 12u' },
  { n: '8', var: 'Tiempo de desarme',             dist: 'Uniforme',        formula: 'TDD = 5 + 55u' },
  { n: '9', var: 'Eficacia del proceso',          dist: 'Binomial (tabla)', formula: 'OK ≤ 0.9905' },
]

/* ── Componente principal ── */
const Modelo = ({ onNavigate }) => (
  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

    <div className="page-header">
      <div className="breadcrumb">
        <button onClick={() => onNavigate('bienvenida')}>Inicio</button>
        <span>›</span>
        <span style={{ color: 'var(--text)' }}>Modelo</span>
      </div>
      <h1 className="page-title">Modelo del Sistema</h1>
    </div>

    <div className="page-body fade-in">

      {/* Diagrama de flujo */}
      <div className="card">
        <div className={styles.flowContainer}>
          {NODES.map((node, i) => (
            <React.Fragment key={i}>
              <FlowNode {...node} />
              {i < NODES.length - 1 && <Arrow />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabla de distribuciones */}
      <div style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-title">
            <div className="card-title-icon" style={{ background: 'rgba(0,212,200,0.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4c8" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </div>
            Distribuciones de Probabilidad
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {DISTRIBUCIONES.map(({ n, var: v, dist, formula }) => (
              <div key={n} className="card-inner" style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: 'var(--teal-dim)', color: 'var(--teal)',
                    fontSize: '0.65rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {n}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text)', fontWeight: 500 }}>{v}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--teal)', marginTop: 2 }}>{dist}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>{formula}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Modelo
