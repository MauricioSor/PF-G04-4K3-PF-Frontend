import React from 'react'
import { Bar } from 'react-chartjs-2'
import { useHistogramaGenerador } from '../../hooks/useHistogramaGenerador'
import styles from './HistogramaGenerador.module.css'

const HistogramaGenerador = ({ grilla, rng }) => {
  const { stats, chartData, opciones, statRows } = useHistogramaGenerador(grilla)

  if (!stats || !chartData) {
    return (
      <div className={styles.empty}>
        No hay datos del generador disponibles.
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.intro}>
        Histograma de los <strong>{stats.n.toLocaleString('es-AR')}</strong> números aleatorios
        <span className={styles.mono}> u</span> que la simulación consumió, agrupados en 10 deciles.
        Si el generador es uniforme, todas las barras deberían acercarse a la línea punteada.
      </p>

      {rng && (
        <div className={styles.badge}>
          Método: <span className={styles.badgeVal}>{rng.type}</span>
          · Semilla: <span className={styles.badgeVal}>{rng.seed}</span>
          · u totales: <span className={styles.badgeVal}>{rng.totalUConsumidos?.toLocaleString('es-AR')}</span>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.chartCard}>
          <div className={styles.chartWrap}>
            <Bar data={chartData} options={opciones} />
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsTitle}>Estadísticas de la muestra</div>
          {statRows.map(({ label, value }) => (
            <div key={label} className={styles.statRow}>
              <span className={styles.statLabel}>{label}</span>
              <span className={styles.statValue}>{value}</span>
            </div>
          ))}
          <div className={styles.statsNote}>
            Cuanto más cerca de <span className={styles.mono}>0,5000</span> esté la media muestral
            y más parejas estén las 10 barras, mejor uniformidad presenta el generador.
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistogramaGenerador
