import { useState, useRef, useEffect } from 'react'

/* ── Catálogo de métodos RNG ── */
export const METODOS = [
  { value: 'centralSquare',              label: '1. Parte Central del Cuadrado', params: [] },
  { value: 'lehmer',                     label: '2. Método de Lehmer',           params: ['a', 'm'] },
  { value: 'mixedCongruential',          label: '3. Congruencial Mixto (LCG)',   params: ['a', 'c', 'm'] },
  { value: 'multiplicativeCongruential', label: '4. Congruencial Multiplicativo', params: ['a', 'm'] },
  { value: 'additiveCongruential',       label: '5. Congruencial Aditivo',       params: ['k', 'm'] },
]

export const PARAM_LABELS = {
  a: 'Multiplicador (a)',
  c: 'Incremento (c)',
  m: 'Módulo (m)',
  k: 'Retardo (k)',
}

export const PARAM_HINTS = {
  a: 'Factor multiplicativo del generador',
  c: 'Constante aditiva (solo Mixto)',
  m: 'Módulo — espacio de estados',
  k: 'Cantidad de valores iniciales',
}

export const isValidNumericInput = (str) =>
  str === '' || /^\d+\.?\d*$/.test(str)

/** Número completo válido (no vacío, no NaN, > 0) */
const isCompletePositive = (str) => {
  if (str === '' || str == null) return false
  const n = parseFloat(str)
  return !isNaN(n) && n > 0
}

export function useEntradasSimulador(onEjecutar) {
  /* Ref estable que siempre apunta a la última onEjecutar */
  const onEjecutarRef = useRef(onEjecutar)
  useEffect(() => { onEjecutarRef.current = onEjecutar }, [onEjecutar])

  const [semilla,     setSemillaState] = useState('')
  const [metodo,      setMetodo]       = useState('lehmer')
  const [params,      setParams]       = useState({})
  const [paramErrors, setParamErrors]  = useState({})

  const metodoInfo = METODOS.find(m => m.value === metodo)

  /* ── Semilla: solo positivos o vacío (aleatoria al ejecutar) ── */
  const setSemilla = (val) => {
    if (isValidNumericInput(val)) setSemillaState(val)
  }

  /* ── Cambio de método → limpiar estado ── */
  const handleMetodoChange = (e) => {
    setMetodo(e.target.value)
    setParams({})
    setParamErrors({})
  }

  const handleParamChange = (key, val) => {
    if (!isValidNumericInput(val)) return

    setParams(prev => ({ ...prev, [key]: val }))

    // Limpiar error cuando el campo queda válido o vacío
    if (val === '' || isCompletePositive(val)) {
      setParamErrors(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const validate = () => {
    if (!metodoInfo) return true

    const errors = {}
    metodoInfo.params.forEach(key => {
      const val = params[key] ?? ''
      if (!isCompletePositive(val)) {
        errors[key] = 'Parámetro requerido — ingresá un número positivo'
      }
    })

    setParamErrors(errors)
    return Object.keys(errors).length === 0
  }

  const buildPayload = () => {
    const mergedParams = {}
    Object.entries(params).forEach(([k, v]) => {
      if (isCompletePositive(v)) mergedParams[k] = parseFloat(v)
    })

    const seedWasRandom = !isCompletePositive(semilla)

    const seed = seedWasRandom
      ? Math.floor(Math.random() * 99000) + 1000
      : parseFloat(semilla)

    return { method: metodo, seed, seedWasRandom, params: mergedParams }
  }

  const handleEjecutar = () => {
    if (!validate()) return
    onEjecutarRef.current(buildPayload())
  }

  return {
    semilla,
    setSemilla,
    metodo,
    params,
    paramErrors,
    metodoInfo,
    handleMetodoChange,
    handleParamChange,
    handleEjecutar,
  }
}
