import React from 'react'
import { Bar } from 'react-chartjs-2'
import { useEquiposPorDia } from '../../hooks/useEquiposPorDia'
import styles from './EquiposPorDia.module.css'

const EquiposPorDia = ({ dias }) => {
  const { chartData, opciones } = useEquiposPorDia(dias)

  if (!chartData) return null

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Equipos procesados por día</span>
        <span className={styles.sub}>Apilados por tipo — refleja la variabilidad de la distribución exponencial de lotes</span>
      </div>
      <div className={styles.chartWrap}>
        <Bar data={chartData} options={opciones} />
      </div>
    </div>
  )
}

export default EquiposPorDia
