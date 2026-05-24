import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Principal from './components/common/Principal'
import Footer from './components/Footer'
import Modelo from './components/Modelo'
import EntradasSimulador from './components/EntradasSimulador'
function App() {
  const [count, setCount] = useState(0)

  return (
      <>
        <Principal/>
        <Modelo/>
        <EntradasSimulador/>
        <Footer/>
      </>
  )
}

export default App
