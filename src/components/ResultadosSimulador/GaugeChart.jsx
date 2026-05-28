import React from 'react'
import { PieChart, Pie, Cell } from 'recharts'

const GaugeChart = ({ pct, color, label }) => {
  const safe = Math.min(Math.max(pct || 0, 0), 100)
  const W = 210
  const H = 115

  const data = [
    { value: safe },
    { value: 100 - safe },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    
      <div style={{ position: 'relative', width: W, height: H, overflow: 'hidden' }}>
        <PieChart width={W} height={H * 2}>
          {/* Pista de fondo*/}
          <Pie
            data={[{ value: 100 }]}
            cx={W / 2} cy={H}
            startAngle={180} endAngle={0}
            innerRadius={64} outerRadius={92}
            dataKey="value"
            strokeWidth={0}
            isAnimationActive={false}
          >
            <Cell fill="rgba(255,255,255,0.07)" />
          </Pie>

          {/* Arco de progreso animado */}
          <Pie
            data={data}
            cx={W / 2} cy={H}
            startAngle={180} endAngle={0}
            innerRadius={64} outerRadius={92}
            dataKey="value"
            strokeWidth={0}
            isAnimationActive
          >
            <Cell fill={color} />
            <Cell fill="transparent" />
          </Pie>
        </PieChart>

        {/* Porcentaje centrado en la base del arco */}
        <div style={{
          position:  'absolute',
          bottom:    4,
          left:      '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
            {safe.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Etiqueta */}
      <div style={{
        fontSize:      '0.7rem',
        color:         'rgba(255,255,255,0.6)',
        marginTop:     6,
        letterSpacing: '0.04em',
      }}>
        {label}
      </div>
    </div>
  )
}

export default GaugeChart
