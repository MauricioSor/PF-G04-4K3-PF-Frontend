import './App.css'
import './components/resultados/graficos/chartSetup.js'
import Principal from './components/common/Principal'
import Footer from './components/Footer'
import Modelo from './components/Modelo'
import EntradasSimulador from './components/EntradasSimulador'
import ResultadosTabs from './components/resultados/ResultadosTabs'
import { useSimulacion } from './hooks/useSimulacion'

function App() {
  const { resultado, estado, ejecutar, reiniciar } = useSimulacion()

  return (
    <>
      <Principal />
      <Modelo />
      <EntradasSimulador onEjecutar={ejecutar} onReiniciar={reiniciar} estado={estado} />
      {estado === 'done' && <ResultadosTabs resultado={resultado} />}
      <Footer />
    </>
  )
}

export default App
