import React from 'react'
import styles from './Bienvenida.module.css'

const Bienvenida = ({ onComenzar }) => (
  <div className={`${styles.bienvenida} fade-in`} style={{ flex: 1, minHeight: 0 }}>

    {/* Partículas de fondo decorativas */}
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{
          position:     'absolute',
          borderRadius: '50%',
          background:   i % 3 === 0
            ? 'rgba(0,212,200,0.08)'
            : i % 3 === 1
              ? 'rgba(100,60,200,0.06)'
              : 'rgba(80,150,255,0.06)',
          width:     `${40 + (i * 23) % 120}px`,
          height:    `${40 + (i * 23) % 120}px`,
          left:      `${(i * 19) % 100}%`,
          top:       `${(i * 31) % 100}%`,
          transform: 'translate(-50%, -50%)',
          filter:    'blur(30px)',
        }} />
      ))}
    </div>

    {/* Contenido centrado */}
    <div style={{ position: 'relative', zIndex: 1 }}>
      <h1 className={styles.title}>
        Bienvenido al Software de Simulación
      </h1>
      <p className={styles.sub}>
        Nave Tierra — San Miguel de Tucumán
      </p>

      {/* Tarjeta TFI con esquinas decorativas */}
      <div className={styles.tfiCard}>
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />
        <div className={styles.tfiCardTitle}>TFI — G04 — 4K3</div>
        <div className={styles.tfiCardSub}>UTN-FRT</div>
      </div>

      <button
        className="btn-primary"
        style={{ padding: '13px 60px', fontSize: '0.95rem' }}
        onClick={onComenzar}
      >
        Comenzar
      </button>
    </div>
  </div>
)

export default Bienvenida
