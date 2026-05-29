import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useDonutsDestino } from '../../hooks/useDonutsDestino'
import styles from './DonutsDestino.module.css'

const DonutsDestino = ({ datos }) => {
  const { dataTipo, dataDestino, opciones } = useDonutsDestino(datos)

  if (!dataTipo || !dataDestino) return null

  return (
    <div className={styles.grid}>
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Distribución por tipo de equipo</span>
          <span className={styles.cardSub}>Modelo: Servidor 25% · Switch/Router 45% · Hogareño 30%</span>
        </div>
        <div className={styles.chartWrap}>
          <Doughnut data={dataTipo} options={opciones} />
        </div>
      </div>
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Distribución por destino</span>
          <span className={styles.cardSub}>Modelo: Reutilización 10% · Desarme 75% · Disposición 15%</span>
        </div>
        <div className={styles.chartWrap}>
          <Doughnut data={dataDestino} options={opciones} />
        </div>
      </div>
    </div>
  )
}

export default DonutsDestino
