import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header({ onMenuToggle }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-btn mobile-menu-btn" onClick={onMenuToggle}>☰</button>
        <div className="header-logo">ASORA</div>
        <form className="search-container" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar asesorías, materias, asesores..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="header-right">
        <button className="header-btn" title="Notificaciones">🔔</button>
        <button className="header-btn" title="Configuración">⚙️</button>
      </div>
    </header>
  )
}
