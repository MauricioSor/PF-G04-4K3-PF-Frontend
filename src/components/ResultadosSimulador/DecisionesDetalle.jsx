import React from 'react'
import { Play } from 'lucide-react'
import styles from './DecisionesDetalle.module.css'

const CONFIGS = {
  nuevoRecepcionista: {
    titulo: 'Incorporar nuevo recepcionista',
    condicion: 'TTR > 160 horas',
    campo: 'TTR_hs',
    unidad: 'hs',
    umbral: 160,
  },
  nuevoOperario: {
    titulo: 'Incorporar nuevo operario',
    condicion: 'TT > 160 horas',
    campo: 'TT_hs',
    unidad: 'hs',
    umbral: 160,
  },
  segundoTurno: {
    titulo: 'Habilitar segundo turno',
    condicion: 'TEP > 800 equipos',
    campo: 'TEP',
    unidad: 'equipos',
    umbral: 800,
  },
}

const MENSAJES = {
  nuevoRecepcionista: {
    si: 'El tiempo de recepción supera el umbral. Se recomienda incorporar personal adicional en recepción.',
    no: 'El tiempo de recepción está dentro del umbral. No se requiere acción inmediata.',
  },
  nuevoOperario: {
    si: 'El tiempo operativo total supera el umbral. Se recomienda incorporar un operario adicional.',
    no: 'El tiempo operativo está dentro del umbral. La dotación actual es suficiente.',
  },
  segundoTurno: {
    si: 'El volumen de equipos procesados supera el umbral. Se recomienda evaluar un segundo turno o convenio.',
    no: 'El volumen de equipos está dentro del umbral. Un solo turno es suficiente.',
  },
}

const DecisionCard = ({ clave, resumen, decisiones }) => {
  const cfg    = CONFIGS[clave]
  const activa = decisiones[clave]
  const valor  = resumen[cfg.campo]
  const fmt    = (n) => typeof n === 'number'
    ? n.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : '—'

  return (
    <div className={`${styles.card} ${activa ? styles.cardActiva : styles.cardInactiva}`}>
      <div className={styles.cardTop}>
        <div className={styles.playDot} style={{ background: activa ? 'var(--teal)' : 'rgba(255,255,255,0.1)' }}>
          <Play size={8} fill={activa ? '#07111f' : 'rgba(255,255,255,0.35)'} color="transparent" />
        </div>
        <span className={styles.cardTitulo}>{cfg.titulo}</span>
        <span className={`${styles.badge} ${activa ? styles.badgeSi : styles.badgeNo}`}>
          {activa ? 'CONDICIÓN CUMPLIDA' : 'NO CUMPLIDA'}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Condición:</span>
        <span className={styles.metaValMono}>{cfg.condicion}</span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Valor obtenido:</span>
        <span className={styles.metaValBold} style={{ color: activa ? 'var(--teal)' : 'var(--text)' }}>
          {fmt(valor)} {cfg.unidad}
        </span>
        <span className={styles.umbralLabel}>(umbral: {cfg.umbral})</span>
      </div>

      <div className={styles.recomendacion}>
        <div className={styles.recomendacionLabel}>Recomendación</div>
        <div className={styles.recomendacionTexto}>
          {activa ? MENSAJES[clave].si : MENSAJES[clave].no}
        </div>
      </div>
    </div>
  )
}

const DecisionesDetalle = ({ resumen, decisiones }) => {
  if (!resumen || !decisiones) return null

  return (
    <div className={styles.wrapper}>
      <p className={styles.intro}>
        Alternativas de decisión evaluadas a partir de los resultados de la simulación
        (lógica IF-THEN-ELSE del modelo).
      </p>
      <div className={styles.grid}>
        {Object.keys(CONFIGS).map(clave => (
          <DecisionCard
            key={clave}
            clave={clave}
            resumen={resumen}
            decisiones={decisiones}
          />
        ))}
      </div>
    </div>
  )
}

export default DecisionesDetalle
