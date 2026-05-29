import React from 'react'
import { useParametrosAvanzados } from '../../hooks/useParametrosAvanzados'
import styles from './ParametrosAvanzados.module.css'
import {
  Server, Network, Laptop,
  Clock, Timer, Wrench,
  Recycle, Trash2, Droplets,
  CheckSquare, ChevronDown, ChevronUp,
} from 'lucide-react'

const ParamCard = ({ titulo, icono: Icono, color, filas }) => (
  <div className={styles.paramCard}>
    <div className={styles.paramCardHeader}>
      <div className={styles.paramCardIcon} style={{ background: `${color}18` }}>
        <Icono size={13} color={color} />
      </div>
      <span className={styles.paramCardTitle}>{titulo}</span>
    </div>
    {filas.map(([k, v, hint]) => (
      <div key={k} className={styles.paramRow}>
        <span className={styles.paramKey}>{k}</span>
        <span className={styles.paramVal}>{v}</span>
        {hint && <span className={styles.paramHint}>{hint}</span>}
      </div>
    ))}
  </div>
)

const ParametrosAvanzados = () => {
  const { abierto, toggle } = useParametrosAvanzados()

  return (
    <div className={styles.wrapper}>
      <button className={styles.toggleBtn} onClick={toggle}>
        {abierto ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        {abierto ? 'Ocultar parámetros avanzados del modelo' : 'Ver parámetros avanzados del modelo'}
      </button>

      {abierto && (
        <div className={`${styles.panel} fade-in`}>
          <p className={styles.panelIntro}>
            Parámetros fijos del modelo de simulación. Para modificarlos es necesario actualizar
            la configuración del servidor de simulación.
          </p>
          <div className={styles.grid}>
            <ParamCard
              titulo="Llegada de lotes"
              icono={Clock}
              color="#00d4c8"
              filas={[
                ['Distribución', 'Exponencial', 'Tiempo entre llegadas'],
                ['Media', '80 min', 'E[tiempo entre lotes]'],
                ['Equipos/lote', 'Unif(5, 15)', 'CE = 5 + 10·u'],
              ]}
            />
            <ParamCard
              titulo="Tiempos de proceso"
              icono={Timer}
              color="#f59e0b"
              filas={[
                ['Recepción', 'Normal(2, 0.5)', 'TR en minutos'],
                ['Diagnóstico', 'Unif(3, 15)', 'TD en minutos'],
                ['Desarme', 'Unif(5, 60)', 'TDD en minutos'],
              ]}
            />
            <ParamCard
              titulo="Tipos de equipo"
              icono={Server}
              color="#60a5fa"
              filas={[
                ['Servidor', 'P = 0.25', 'u ≤ 0.25'],
                ['Switch/Router', 'P = 0.45', '0.25 < u ≤ 0.70'],
                ['Hogareño', 'P = 0.30', '0.70 < u ≤ 1.00'],
              ]}
            />
            <ParamCard
              titulo="Peso por equipo"
              icono={Network}
              color="#c084fc"
              filas={[
                ['Distribución', 'Unif(0.5, 20)', 'P = 0.5 + 19.5·u'],
                ['Mínimo', '0.5 kg', ''],
                ['Máximo', '20 kg', ''],
              ]}
            />
            <ParamCard
              titulo="Destino del diagnóstico"
              icono={Recycle}
              color="#10b981"
              filas={[
                ['Reutilización (EF)', 'F(x) = 0.10', 'u ≤ 0.10'],
                ['Desarme (ED)', 'F(x) = 0.85', '0.10 < u ≤ 0.85'],
                ['Disposición (EI)', 'F(x) = 1.00', '0.85 < u ≤ 1.00'],
              ]}
            />
            <ParamCard
              titulo="Eficacia y ambiente"
              icono={Droplets}
              color="#3b82f6"
              filas={[
                ['Procesado OK', '99.05%', 'u ≤ 0.9905'],
                ['Incidente', '0.95%', 'u > 0.9905'],
                ['Agua / Servidor', '50.000 L', 'si OK'],
                ['Agua / Switch', '15.000 L', 'si OK'],
                ['Agua / Hogareño', '3.000 L', 'si OK'],
              ]}
            />
            <ParamCard
              titulo="Umbrales de decisión"
              icono={CheckSquare}
              color="#a78bfa"
              filas={[
                ['Nuevo recepcionista', 'TTR > 160 hs', ''],
                ['Nuevo operario', 'TT > 160 hs', ''],
                ['Segundo turno', 'TEP > 800 eq.', ''],
              ]}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ParametrosAvanzados
