import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Sessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [tab, setTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/sessions')
      .then(res => setSessions(res.data.sessions || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/sessions/${id}`, { status })
      setSessions(prev => prev.map(s => s.id === id ? res.data.session : s))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar la sesión')
    }
  }

  const filtered = tab === 'all' ? sessions : sessions.filter(s => s.status === tab)
  const tabs = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'confirmed', label: 'Confirmadas' },
    { key: 'completed', label: 'Completadas' },
  ]

  return (
    <>
      <div className="page-title-section">
        <h1 className="page-title">Mis Sesiones</h1>
        <p className="page-subtitle">Gestiona tus asesorías agendadas</p>
      </div>
      <div className="topic-nav" style={{ marginBottom: 'var(--space-2xl)' }}>
        {tabs.map(t => (
          <div key={t.key} className={`topic-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}>{t.label}</div>
        ))}
      </div>
      {loading && <p style={{ color: 'var(--text-muted)' }}>Cargando sesiones...</p>}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--space-md)' }}>📅</p>
          <p>No tienes sesiones {tab !== 'all' ? tab : ''}. ¡Busca un asesor para comenzar!</p>
        </div>
      )}
      {filtered.map(s => (
        <div key={s.id} className="group-card" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="group-card-header">
            <div>
              <h2 className="group-title">{s.subject?.name}</h2>
              <div className="group-advisor">
                <div className="group-advisor-avatar">👤</div>
                <span>{s.advisor?.user?.full_name || 'Asesor'}</span>
              </div>
              <div className="group-topics">
                📅 {new Date(s.scheduled_at).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                {' · '}🕐 {new Date(s.scheduled_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <span className={`group-badge ${s.status === 'confirmed' ? 'badge-presencial' : 'badge-online'}`}>
              {s.status === 'pending' ? '⏳ Pendiente' : s.status === 'confirmed' ? '✅ Confirmada' : s.status === 'completed' ? '🎓 Completada' : '❌ Cancelada'}
            </span>
          </div>
          
          {s.status === 'pending' && s.advisor?.user_id === user?.id && (
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn-primary" onClick={() => updateStatus(s.id, 'confirmed')} style={{ padding: 'var(--space-xs) var(--space-md)' }}>Confirmar</button>
              <button className="btn-secondary" onClick={() => updateStatus(s.id, 'cancelled')} style={{ padding: 'var(--space-xs) var(--space-md)' }}>Rechazar</button>
            </div>
          )}
          {s.status === 'pending' && s.advisee_id === user?.id && (
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn-secondary" onClick={() => updateStatus(s.id, 'cancelled')} style={{ padding: 'var(--space-xs) var(--space-md)' }}>Cancelar Solicitud</button>
            </div>
          )}
          {s.status === 'confirmed' && s.advisor?.user_id === user?.id && (
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn-primary" onClick={() => updateStatus(s.id, 'completed')} style={{ padding: 'var(--space-xs) var(--space-md)' }}>Marcar como Completada</button>
              <button className="btn-secondary" onClick={() => updateStatus(s.id, 'cancelled')} style={{ padding: 'var(--space-xs) var(--space-md)' }}>Cancelar</button>
            </div>
          )}
          {s.status === 'completed' && s.advisee_id === user?.id && !s.review && (
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn-primary" onClick={() => alert('TODO: Mostrar modal de reseña')} style={{ padding: 'var(--space-xs) var(--space-md)' }}>Dejar Reseña</button>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
