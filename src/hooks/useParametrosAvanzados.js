import { useState } from 'react'

export function useParametrosAvanzados() {
  const [abierto, setAbierto] = useState(false)
  const toggle = () => setAbierto(v => !v)
  return { abierto, toggle }
}
