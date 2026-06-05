import { useState, useRef, useEffect } from 'react'

/* ── Único método RNG disponible ── */
export const METODOS = [
  { value: 'mixedCongruential', label: 'Congruencial Mixto (LCG)', params: ['a', 'c', 'm'] },
]

export const PARAM_LABELS = {
  a: 'Multiplicador (a)',
  c: 'Incremento (c)',
  m: 'Módulo (m)',
}

export const PARAM_HINTS = {
  a: 'Factor multiplicativo del generador',
  c: 'Constante aditiva (≠ 0)',
  m: 'Módulo — espacio de estados',
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
  const [semillaError, setSemillaError] = useState('')
  const [params,      setParams]       = useState({})
  const [paramErrors, setParamErrors]  = useState({})

  // Método fijo: Congruencial Mixto
  const metodo     = 'mixedCongruential'
  const metodoInfo = METODOS[0]

  /* ── Semilla: solo positivos o vacío (aleatoria al ejecutar) ── */
  const setSemilla = (val) => {
    if (isValidNumericInput(val)) {
      setSemillaState(val)
      // Limpiar error de semilla al editar
      setSemillaError('')
    }
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
    const errors = {}
    metodoInfo.params.forEach(key => {
      const val = params[key] ?? ''
      if (!isCompletePositive(val)) {
        errors[key] = 'Parámetro requerido — ingresá un número positivo'
      }
    })

    setParamErrors(errors)

    // Validar semilla manual contra el módulo m
    if (isCompletePositive(semilla)) {
      const seedVal = parseFloat(semilla)
      const mVal    = parseFloat(params['m'] ?? '')
      if (isCompletePositive(params['m']) && seedVal >= mVal) {
        setSemillaError(`La semilla debe ser menor que el módulo m (${mVal.toLocaleString('es-AR')})`)
        return false
      }
    }
    setSemillaError('')

    return Object.keys(errors).length === 0
  }

  const buildPayload = () => {
    const mergedParams = {}
    Object.entries(params).forEach(([k, v]) => {
      if (isCompletePositive(v)) mergedParams[k] = parseFloat(v)
    })

    const seedWasRandom = !isCompletePositive(semilla)

    /* Semilla aleatoria: siempre en [0, m) para respetar el espacio de estados */
    const m = parseFloat(params['m'] ?? '0')
    const seed = seedWasRandom
      ? Math.floor(Math.random() * m)   // 0 ≤ seed < m
      : parseFloat(semilla)

    return { method: metodo, seed, seedWasRandom, params: mergedParams }
  }

  const handleEjecutar = () => {
    if (!validate()) return
    onEjecutarRef.current(buildPayload())
  }

  return {
    semilla,
    semillaError,
    setSemilla,
    metodo,
    params,
    paramErrors,
    metodoInfo,
    handleParamChange,
    handleEjecutar,
  }
}
