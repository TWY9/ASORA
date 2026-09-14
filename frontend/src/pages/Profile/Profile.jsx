import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import ApplyAdvisorModal from '../../components/ApplyAdvisorModal/ApplyAdvisorModal'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [stats, setStats] = useState({
    recibidas: 0,
    dadas: 0,
    horas: 0,
    rating: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [adviseeRes, profilesRes] = await Promise.all([
          api.get('/sessions?role=advisee'),
          api.get('/advisors/my-profiles')
        ])

        const recibidas = adviseeRes.data.sessions.filter(s => s.status === 'completed').length
        
        let dadas = 0
        let horas = 0
        let ratingSum = 0
        let profilesWithRating = 0

        const profiles = profilesRes.data.profiles || []
        profiles.forEach(p => {
          horas += p.total_hours
          if (p.avg_rating > 0) {
            ratingSum += p.avg_rating
            profilesWithRating++
          }
        })

        const advisorRes = await api.get('/sessions?role=advisor')
        dadas = advisorRes.data.sessions.filter(s => s.status === 'completed').length

        setStats({
          recibidas,
          dadas,
          horas,
          rating: profilesWithRating > 0 ? (ratingSum / profilesWithRating).toFixed(1) : 0
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    }
    
    if (user) {
      fetchStats()
    }
  }, [user])

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const handleApplySuccess = () => {
    setShowApplyModal(false)
    setSuccessMsg('Solicitud enviada correctamente. El administrador la revisará pronto.')
    setTimeout(() => setSuccessMsg(''), 5000)
  }

  return (
    <>
      <div className="page-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Mi Perfil</h1>
          <p className="page-subtitle">Tu información personal y estadísticas</p>
        </div>
        <button className="btn-primary" onClick={() => setShowApplyModal(true)}>🎓 Convertirme en Asesor</button>
      </div>

      {successMsg && <div className="auth-error" style={{ background: 'var(--available)', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', marginBottom: 'var(--space-lg)' }}>{successMsg}</div>}

      <div className="profile-card-large">
        <div className="profile-card-avatar">{initials}</div>
        <div className="profile-card-info">
          <h2>{user?.full_name}</h2>
          <p className="profile-meta">No. Control: {user?.control_number}</p>
          <p className="profile-meta">{user?.career}</p>
          <p className="profile-meta">{user?.semester}° Semestre</p>
          <div className="profile-badges">
            <span className={`group-badge ${user?.role === 'asesor' || user?.role === 'both' ? 'badge-presencial' : 'badge-online'}`}>
              {user?.role === 'both' ? '📚 Asesor y Asesorado' : user?.role === 'asesor' ? '🎓 Asesor' : '📖 Asesorado'}
            </span>
            <span className="profile-status">Activo</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.recibidas}</div>
          <div className="stat-label">Asesorías Recibidas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.dadas}</div>
          <div className="stat-label">Asesorías Dadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.horas}h</div>
          <div className="stat-label">Horas Acumuladas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.rating > 0 ? `⭐ ${stats.rating}` : '—'}</div>
          <div className="stat-label">Rating Promedio</div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyAdvisorModal 
          onClose={() => setShowApplyModal(false)} 
          onSuccess={handleApplySuccess} 
        />
      )}
    </>
  )
}

