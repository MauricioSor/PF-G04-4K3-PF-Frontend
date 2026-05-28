import React from 'react'
import styles from './EntradasSimulador.module.css'
import {
  useEntradasSimulador,
  METODOS,
  PARAM_LABELS,
  PARAM_HINTS,
} from '../../hooks/useEntradasSimulador'

import {
  Server, Network, Laptop,
  Recycle, Wrench, Trash2,
  CheckCircle, AlertTriangle,
  Monitor, RefreshCcw, Play,
  Cpu, Zap,
} from 'lucide-react'

const FORMULAS = {
  centralSquare: {
    formula: 'Xₙ₊₁ = middle_n_digits( Xₙ² )',
    vars: [
      { key: 'Xₙ',  desc: 'Valor actual — cuadrado del período anterior' },
      { key: 'X₀',  desc: 'Semilla inicial', constraint: 'mínimo 4 dígitos' },
      { key: 'Uₙ',  desc: 'Número aleatorio generado: Uₙ = Xₙ / 10ⁿ' },
    ],
    note: 'Extrae los n dígitos centrales del cuadrado del valor actual.',
  },
  lehmer: {
    formula: 'Xₙ₊₁ = ( a · Xₙ ) mod m',
    vars: [
      { key: 'a', desc: 'Multiplicador',        constraint: 'e.g. 16807' },
      { key: 'm', desc: 'Módulo (primo grande)', constraint: 'e.g. 2147483647 = 2³¹ − 1' },
      { key: 'X₀', desc: 'Semilla: 0 < X₀ < m' },
      { key: 'Uₙ', desc: 'Número aleatorio: Uₙ = Xₙ / m' },
    ],
    note: 'Variante multiplicativa pura. Requiere m primo y a primitiva raíz mod m.',
  },
  mixedCongruential: {
    formula: 'Xₙ₊₁ = ( a · Xₙ + c ) mod m',
    vars: [
      { key: 'a', desc: 'Multiplicador',   constraint: 'e.g. 1664525' },
      { key: 'c', desc: 'Incremento (≠0)', constraint: 'e.g. 1013904223' },
      { key: 'm', desc: 'Módulo',          constraint: 'e.g. 4294967296 = 2³²' },
      { key: 'X₀', desc: 'Semilla: 0 ≤ X₀ < m' },
      { key: 'Uₙ', desc: 'Número aleatorio: Uₙ = Xₙ / m' },
    ],
    note: 'Período máximo si: mcd(c, m) = 1; a − 1 divisible por todos los factores primos de m; y si 4 | m entonces 4 | (a − 1).',
  },
  multiplicativeCongruential: {
    formula: 'Xₙ₊₁ = ( a · Xₙ ) mod m',
    vars: [
      { key: 'a', desc: 'Multiplicador', constraint: 'a ≡ 3 o 5 (mod 8) para período máximo' },
      { key: 'm', desc: 'Módulo',        constraint: 'potencia de 2, e.g. 2³² = 4294967296' },
      { key: 'X₀', desc: 'Semilla impar, 0 < X₀ < m' },
      { key: 'Uₙ', desc: 'Número aleatorio: Uₙ = Xₙ / m' },
    ],
    note: 'c = 0. Período máximo m/4 cuando a ≡ ±3 (mod 8) y X₀ es impar.',
  },
  additiveCongruential: {
    formula: 'Xₙ = ( Xₙ₋₁ + Xₙ₋ₖ ) mod m',
    vars: [
      { key: 'k',  desc: 'Retardo (lag) — tamaño de la tabla inicial', constraint: 'entero ≥ 2, e.g. 5' },
      { key: 'm',  desc: 'Módulo',                                      constraint: 'e.g. 2147483647 = 2³¹ − 1' },
      { key: 'X₀…Xₖ₋₁', desc: 'Tabla inicial generada por Lehmer a partir de la semilla' },
      { key: 'Uₙ', desc: 'Número aleatorio: Uₙ = Xₙ / m' },
    ],
    note: 'La tabla de k valores se inicializa automáticamente con el método de Lehmer usando la semilla provista.',
  },
}

/* ── Utilidades de input ── */
const inputStyle = (hasError) => ({
  borderColor: hasError ? 'rgba(239,68,68,0.7)' : undefined,
  boxShadow:   hasError ? '0 0 0 2px rgba(239,68,68,0.18)' : undefined,
})

/* Bloquea teclas inválidas: solo permite dígitos, punto decimal y teclas de control */
const blockInvalidKeys = (e) => {
  const ctrl = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Enter']
  if (ctrl.includes(e.key) || e.ctrlKey || e.metaKey || e.key === '.') return
  if (!/^\d$/.test(e.key)) e.preventDefault()
}

/* ── Componente de fórmula ── */
const FormulaSection = ({ metodo }) => {
  const f = FORMULAS[metodo]
  if (!f) return null
  return (
    <div className={styles.formulaBox}>
      <div className={styles.formulaLabel}>Fórmula del método</div>
      <div className={styles.formulaExpr}>{f.formula}</div>
      <div className={styles.formulaVars}>
        {f.vars.map(({ key, desc, constraint }) => (
          <div key={key} className={styles.formulaVarRow}>
            <span className={styles.formulaVarKey}>{key}</span>
            <span className={styles.formulaVarDesc}>
              {desc}
              {constraint && (
                <span className={styles.formulaVarConstraint}> ({constraint})</span>
              )}
            </span>
          </div>
        ))}
      </div>
      {f.note && (
        <div style={{ fontSize: '0.65rem', color: 'rgba(168,85,247,0.6)', marginTop: 8, fontStyle: 'italic', lineHeight: 1.4 }}>
          {f.note}
        </div>
      )}
    </div>
  )
}

const EntradasSimulador = ({ onEjecutar, onReiniciar, cargando, error }) => {
  const {
    semilla, setSemilla,
    metodo, params, paramErrors,
    metodoInfo,
    handleMetodoChange, handleParamChange, handleEjecutar,
  } = useEntradasSimulador(onEjecutar)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* ── Encabezado ── */}
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div className="breadcrumb">
          <span>Inicio</span><span>›</span>
          <span style={{ color: 'var(--text)' }}>Configuración</span>
        </div>
        <h1 className="page-title">Configuración de la Simulación</h1>
      </div>

      {/* ── Cuerpo ── */}
      <div className="page-body fade-in">
        <div className={styles.configGrid}>

          {/* ══ Columna izquierda ══ */}
          <div className={styles.configLeft}>

            {/* General */}
            <div className="card">
              <div className="card-title">
                <div className="card-title-icon" style={{ background: 'rgba(0,212,200,0.12)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4c8" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/>
                  </svg>
                </div>
                General
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div className="input-group">
                    <label className="input-label">Días de Simulación</label>
                    <input type="number" value={30} readOnly />
                    <span className="input-hint">Fijo: 30 días laborables (8 hs/día)</span>
                  </div>
                </div>
                <div>
                  <div className="section-sub" style={{ marginBottom: 8 }}>Parámetros del modelo</div>
                  {[
                    ['Lotes:',        'Exp(E=80 min)'],
                    ['Equipos/lote:', 'Unif(5–15)'],
                    ['Recepción:',    'Normal(2, 0.5)'],
                    ['Diagnóstico:',  'Unif(3–15)'],
                    ['Desarme:',      'Unif(5–60)'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 5, color: 'var(--text-muted)' }}>
                      <span>{k}</span>
                      <span style={{ color: 'var(--text)', fontFamily: 'monospace' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Distribución de Tipos */}
            <div className="card">
              <div className="card-title">
                <div className="card-title-icon" style={{ background: 'rgba(91,187,255,0.12)' }}>
                  <Monitor size={14} color="#5bbfff" />
                </div>
                Distribución de Tipos
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: 6, paddingRight: 8 }}>P(x) / F(x)</div>
                  {[
                    { Icon: Server,  color: '#10b981', label: 'Servidor',      val: '0.25 / 0.25' },
                    { Icon: Network, color: '#3b82f6', label: 'Switch/Router', val: '0.45 / 0.70' },
                    { Icon: Laptop,  color: '#8b5cf6', label: 'Hogareño',      val: '0.30 / 1.00' },
                  ].map(({ Icon, color, label, val }) => (
                    <div key={label} className={styles.distRow}>
                      <div className={styles.distIcon} style={{ background: `${color}22`, color }}>
                        <Icon size={13} />
                      </div>
                      <span className={styles.distName}>{label}</span>
                      <span className={styles.distVal}>{val}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: 6 }}>
                    <span>Destino</span><span>F(x)</span>
                  </div>
                  {[
                    { Icon: Recycle, color: '#10b981', label: 'Reutilización', val: '0.10' },
                    { Icon: Wrench,  color: '#f59e0b', label: 'Desarme',       val: '0.85' },
                    { Icon: Trash2,  color: '#ef4444', label: 'Desecho',       val: '1.00' },
                  ].map(({ Icon, color, label, val }) => (
                    <div key={label} className={styles.distRow}>
                      <div className={styles.distIcon} style={{ background: `${color}22`, color }}>
                        <Icon size={13} />
                      </div>
                      <span className={styles.distName}>{label}</span>
                      <span className={styles.distVal} style={{ color }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══ Columna central: Generador RNG ══ */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card-title">
              <div className="card-title-icon" style={{ background: 'rgba(168,85,247,0.12)' }}>
                <Cpu size={14} color="#a855f7" />
              </div>
              Generador RNG
            </div>

            {/* Selector de método */}
            <div className="input-group">
              <label className="input-label">Método</label>
              <select value={metodo} onChange={handleMetodoChange}>
                {METODOS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <span className="input-hint">Algoritmo de generación de números pseudoaleatorios</span>
            </div>

            {/* Fórmula del método seleccionado */}
            <FormulaSection metodo={metodo} />

            {/* Semilla */}
            <div className="input-group">
              <label className="input-label">Semilla</label>
              <input
                type="text"
                inputMode="decimal"
                value={semilla}
                onChange={e => setSemilla(e.target.value)}
                onKeyDown={blockInvalidKeys}
                placeholder="Vacío = semilla aleatoria"
              />
              <span className="input-hint">Misma semilla → mismos resultados reproducibles</span>
            </div>

            {/* Parámetros dinámicos del método */}
            {metodoInfo?.params.length === 0 ? (
              <div className="card-inner" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', padding: '10px 12px' }}>
                Este método no requiere parámetros adicionales.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="section-sub">Parámetros del método</div>
                {metodoInfo?.params.map(key => {
                  const hasError = !!paramErrors[key]
                  return (
                    <div key={key} className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">{PARAM_LABELS[key]}</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={params[key] ?? ''}
                        onChange={e => handleParamChange(key, e.target.value)}
                        onKeyDown={blockInvalidKeys}
                        placeholder="Número positivo requerido"
                        style={inputStyle(hasError)}
                      />
                      {hasError
                        ? <span className={styles.inputError}>{paramErrors[key]}</span>
                        : <span className="input-hint">{PARAM_HINTS[key]}</span>
                      }
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ══ Columna derecha: Eficacia y Ambiente ══ */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card-title">
              <div className="card-title-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                <Zap size={14} color="#3b82f6" />
              </div>
              Eficacia y Ambiente
            </div>

            <div>
              <div className="section-sub">Eficacia del procesamiento</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="card-inner" style={{ textAlign: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <CheckCircle size={16} color="#10b981" />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 4 }}>Correcto</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>99.05%</div>
                </div>
                <div className="card-inner" style={{ textAlign: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <AlertTriangle size={16} color="#f59e0b" />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 4 }}>Incidente</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b' }}>0.95%</div>
                </div>
              </div>
            </div>

            <div>
              <div className="section-sub">Agua evitada (por equipo)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { Icon: Server,  color: '#10b981', label: 'Servidor',  val: '50.000 L' },
                  { Icon: Network, color: '#3b82f6', label: 'Switch',    val: '15.000 L' },
                  { Icon: Laptop,  color: '#8b5cf6', label: 'Hogareño',  val: '3.000 L'  },
                ].map(({ Icon, color, label, val }) => (
                  <div key={label} className="card-inner" style={{ textAlign: 'center', padding: '10px 6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                      <Icon size={16} color={color} />
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-sub">Umbrales de decisión</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 2 }}>
                <div>TTR &gt; 160 hs → nuevo recepcionista</div>
                <div>TT &gt; 160 hs → nuevo operario</div>
                <div>TEP &gt; 800 eq. → 2do turno</div>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="alert-error" style={{ marginTop: 14 }}>{error}</div>}
      </div>

      {/* ── Footer ── */}
      <div className="page-footer" style={{ flexShrink: 0 }}>
        <button className="btn-secondary" onClick={onReiniciar} disabled={cargando}>
          <RefreshCcw size={14} /> Reiniciar
        </button>
        <button className="btn-primary" onClick={handleEjecutar} disabled={cargando}>
          {cargando
            ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Simulando...</>
            : <><Play size={12} fill="#07111f" color="transparent" /> Ejecutar Simulación</>
          }
        </button>
      </div>
    </div>
  )
}

export default EntradasSimulador
