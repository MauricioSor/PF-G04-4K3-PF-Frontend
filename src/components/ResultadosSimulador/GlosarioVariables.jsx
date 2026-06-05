import React from 'react'
import { useGlosario } from '../../hooks/useGlosario'
import styles from './GlosarioVariables.module.css'

const GlosarioVariables = () => {
  const { grupos } = useGlosario()

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerIcon} />
        <span className={styles.headerTitle}>Glosario de variables</span>
      </div>

      {grupos.map(g => (
        <div key={g.titulo} className={styles.grupo}>
          <div className={styles.grupoTitulo} style={{ color: g.color }}>
            {g.titulo}
          </div>
          {g.items.map(([sigla, desc]) => (
            <div key={sigla} className={styles.item}>
              <span className={styles.sigla}>{sigla}</span>
              <span className={styles.desc}>{desc}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default GlosarioVariables
