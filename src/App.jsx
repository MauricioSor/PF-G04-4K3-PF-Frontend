import React from 'react'
import './index.css'
import './App.css'

import { useSimulacion } from './hooks/useSimulacion'

import Sidebar             from './components/Sidebar/Sidebar'
import Bienvenida          from './components/Bienvenida/Bienvenida'
import Modelo              from './components/Modelo/Modelo'
import EntradasSimulador   from './components/EntradasSimulador/EntradasSimulador'
import ResultadosSimulador from './components/ResultadosSimulador/ResultadosSimulador'

function App() {
  const {
    view, setView,
    resultados,
    cargando, error,
    ejecutarSimulacion,
    reiniciar,
  } = useSimulacion()

  const renderView = () => {
    switch (view) {
      case 'bienvenida':
        return <Bienvenida onComenzar={() => setView('configuracion')} />

      case 'modelo':
        return <Modelo onNavigate={setView} />

      case 'configuracion':
        return (
          <EntradasSimulador
            onEjecutar={ejecutarSimulacion}
            onReiniciar={reiniciar}
            cargando={cargando}
            error={error}
          />
        )

      case 'resultados':
        return (
          <ResultadosSimulador
            datos={resultados}
            onEjecutar={() => setView('configuracion')}
            onReiniciar={reiniciar}
          />
        )

      default:
        return <Bienvenida onComenzar={() => setView('configuracion')} />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar currentView={view} onNavigate={setView} />
      <div className="content-area">
        {renderView()}
      </div>
    </div>
  )
}

export default App
