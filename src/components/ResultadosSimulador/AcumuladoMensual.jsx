import React from 'react'
import { Line } from 'react-chartjs-2'
import { useAcumuladoMensual } from '../../hooks/useAcumuladoMensual'
import styles from './AcumuladoMensual.module.css'

const AcumuladoMensual = ({ dias }) => {
  const { chartData, opciones } = useAcumuladoMensual(dias)

  if (!chartData) return null

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Evolución acumulada a lo largo del mes</span>
        <span className={styles.sub}>Equipos procesados (TEP) y litros de agua no contaminada, día a día</span>
      </div>
      <div className={styles.chartWrap}>
        <Line data={chartData} options={opciones} />
      </div>
    </div>
  )
}

export default AcumuladoMensual
