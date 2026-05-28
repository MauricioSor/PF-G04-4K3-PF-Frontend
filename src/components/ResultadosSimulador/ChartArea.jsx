import React, { useMemo, memo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const ChartArea = memo(({ data, color, title, gradientId }) => {

  const chartData = useMemo(
    () => (data ?? []).map((v, i) => ({ dia: i + 1, value: v })),
    [data]
  )

  /* Estado vacío */
  if (!chartData.length) {
    return (
      <div style={{
        flex:            1,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        color:           'rgba(255,255,255,0.3)',
        fontSize:        '0.78rem',
      }}>
        {title}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* Título */}
      <div style={{
        textAlign:    'center',
        fontSize:     '0.72rem',
        fontWeight:   600,
        color:        'rgba(255,255,255,0.65)',
        marginBottom: 6,
        flexShrink:   0,
      }}>
        {title}
      </div>

      {/* Gráfico */}
      <div style={{ flex: 1, minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 6, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 5"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="dia"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              ticks={[1, 8, 15, 22, 30]}
              tickFormatter={v => `D${v}`}
            />

            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />

            <Tooltip
              contentStyle={{
                background:   'rgba(7, 17, 31, 0.97)',
                border:       `1px solid ${color}55`,
                borderRadius: 8,
                fontSize:     '0.72rem',
                boxShadow:    `0 4px 24px ${color}22`,
              }}
              labelFormatter={v  => `Día ${v}`}
              formatter={(v)     => [`${v.toFixed(1)} hs`, '']}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              itemStyle={{ color }}
              cursor={{ stroke: `${color}55`, strokeWidth: 1, strokeDasharray: '3 3' }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})

ChartArea.displayName = 'ChartArea'

export default ChartArea
