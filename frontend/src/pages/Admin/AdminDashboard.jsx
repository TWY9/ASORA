import { useState, useEffect } from 'react'
import api from '../../services/api'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [pending, setPending] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('solicitudes') // solicitudes | usuarios
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [pendRes, userRes] = await Promise.all([
        api.get('/admin/pending-advisors'),
        api.get('/admin/users')
      ])
      setPending(pendRes.data.profiles || [])
      setUsers(userRes.data.users || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Error cargando datos del administrador')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (advisorId, action) => {
    try {
      await api.patch(`/admin/advisors/${advisorId}/verify`, { action })
      // Remover de la lista de pendientes
      setPending(prev => prev.filter(p => p.id !== advisorId))
    } catch (err) {
      alert(err.response?.data?.error || 'Error al procesar la solicitud')
    }
  }

  return (
    <>
      <div className="page-title-section">
        <h1 className="page-title">Panel de Administración</h1>
        <p className="page-subtitle">Gestiona usuarios y aprueba nuevos asesores</p>
      </div>

      <div className="topic-nav" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className={`topic-tab ${tab === 'solicitudes' ? 'active' : ''}`} onClick={() => setTab('solicitudes')}>
          Solicitudes de Asesores ({pending.length})
        </div>
        <div className={`topic-tab ${tab === 'usuarios' ? 'active' : ''}`} onClick={() => setTab('usuarios')}>
          Usuarios ({users.length})
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {loading && <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>}

      {!loading && tab === 'solicitudes' && (
        <div className="admin-table-container">
          {pending.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No hay solicitudes pendientes.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Materia</th>
                  <th>Modalidad</th>
                  <th>Kardex / Evidencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.user?.full_name}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{p.user?.control_number}</div>
                    </td>
                    <td>{p.subject?.name}</td>
                    <td><span className={`group-badge ${p.modality === 'online' ? 'badge-online' : 'badge-presencial'}`}>{p.modality}</span></td>
                    <td>
                      {p.recommendation_doc ? (
                        <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${p.recommendation_doc}`} target="_blank" rel="noreferrer" className="link-evidencia">
                          Ver Archivo 📄
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Sin evidencia</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 'var(--font-sm)' }} onClick={() => handleVerify(p.id, 'approve')}>Aprobar</button>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 'var(--font-sm)', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleVerify(p.id, 'reject')}>Rechazar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!loading && tab === 'usuarios' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Control</th>
                <th>Nombre</th>
                <th>Carrera</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.control_number}</td>
                  <td>{u.full_name}</td>
                  <td>{u.career}</td>
                  <td><span className="group-badge" style={{ background: 'var(--bg-input)' }}>{u.role}</span></td>
                  <td>
                    <span style={{ color: u.is_active ? 'var(--available)' : 'var(--danger)' }}>
                      {u.is_active ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
