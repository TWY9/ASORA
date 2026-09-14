import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [asesoriasOpen, setAsesoriasOpen] = useState(
    location.pathname === '/' || location.pathname === '/grupos'
  )

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      {/* Profile */}
      <div className="profile-section">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-name">{user?.full_name || 'Usuario'}</div>
        <div className="profile-career">{user?.career || 'Carrera'}</div>
        <span className="profile-status">Activo</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-item">
          <NavLink to="/perfil" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <span className="nav-icon">👤</span>
            Perfil
          </NavLink>
        </div>

        <div className={`nav-item ${asesoriasOpen ? 'expanded' : ''}`}>
          <div className="nav-link active" onClick={() => setAsesoriasOpen(!asesoriasOpen)}>
            <span className="nav-icon">📚</span>
            Asesorías
            <span className="nav-arrow">▶</span>
          </div>
          <div className="sub-nav">
            <NavLink to="/" end className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              Individual
            </NavLink>
            <NavLink to="/grupos" className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              Grupal
            </NavLink>
          </div>
        </div>

        <div className="nav-item">
          <NavLink to="/buscar" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <span className="nav-icon">🔍</span>
            Buscar Asesores
          </NavLink>
        </div>

        <div className="nav-item">
          <NavLink to="/sesiones" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <span className="nav-icon">📅</span>
            Mis Sesiones
          </NavLink>
        </div>

        {user?.role === 'admin' && (
          <div className="nav-item">
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span className="nav-icon">🛡️</span>
              Admin Panel
            </NavLink>
          </div>
        )}

        <div className="nav-item nav-item-bottom">
          <button className="nav-link" onClick={logout}>
            <span className="nav-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </aside>
  )
}
