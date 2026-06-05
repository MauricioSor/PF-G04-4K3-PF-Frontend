import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

export function useSimulacion() {
  const [view,       setView]       = useState('bienvenida')
  const [resultados, setResultados] = useState(null)
  const [cargando,   setCargando]   = useState(false)
  const [error,      setError]      = useState(null)

  const ejecutarSimulacion = async (config) => {
    setCargando(true)
    setError(null)
    try {
      const res  = await fetch(`${API_BASE}/simulate/naveTierra`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(config),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
      setResultados(data)
      setView('resultados')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const reiniciar = () => {
    setResultados(null)
    setError(null)
    setView('configuracion')
  }

  return {
    view,
    setView,
    resultados,
    cargando,
    error,
    ejecutarSimulacion,
    reiniciar,
  }
}
