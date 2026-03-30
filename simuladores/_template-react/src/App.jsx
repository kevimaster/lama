import { useState } from 'react'
import './App.css'

export default function App() {
  const [activo, setActivo] = useState(false)

  return (
    <div className="lama-app">
      <header className="lama-header">
        <a href="../../index.html" className="back-link">← Portal LAMA</a>
        <div>
          <span className="sim-id">LAMA-XX</span>
          <h1>Nombre del Simulador</h1>
        </div>
      </header>

      <main className="lama-main">
        <div className="simulador-area">
          {/* ── Tu simulador aquí ── */}
          <p className="placeholder">Contenido del simulador</p>
        </div>

        <div className="controles">
          <button onClick={() => setActivo(true)}>Iniciar</button>
          <button className="secundario" onClick={() => setActivo(false)}>Reiniciar</button>
        </div>
      </main>

      <footer className="lama-footer">
        LAMA — Universidad del Valle · Cali, Colombia
      </footer>
    </div>
  )
}
