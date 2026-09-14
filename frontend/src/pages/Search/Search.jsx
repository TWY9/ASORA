import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import ScheduleModal from '../../components/ScheduleModal/ScheduleModal'

export default function Search() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [modality, setModality] = useState('')
  const [minRating, setMinRating] = useState('')
  const [advisors, setAdvisors] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAdvisor, setSelectedAdvisor] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchAdvisors = async () => {
      setLoading(true)
      try {
        let url = `/advisors?search=${encodeURIComponent(query)}`
        if (modality) url += `&modality=${modality}`
        if (minRating) url += `&min_rating=${minRating}`
        const res = await api.get(url)
        setAdvisors(res.data.advisors || [])
      } catch {
        setAdvisors([])
      } finally {
        setLoading(false)
      }
    }
    
    // Si no hay query, aún queremos cargar asesores si hay filtros
    const timeoutId = setTimeout(() => {
      fetchAdvisors()
    }, 300) // debounce
    return () => clearTimeout(timeoutId)
  }, [query, modality, minRating])

  const handleSuccess = () => {
    setSelectedAdvisor(null)
    setSuccessMessage('¡Asesoría agendada con éxito! Esperando confirmación del asesor.')
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  return (
    <>
      <div className="page-title-section">
        <h1 className="page-title">Buscar Asesores</h1>
        <p className="page-subtitle">Encuentra el asesor ideal por materia, horario o valoración</p>
      </div>

      {successMessage && <div className="auth-error" style={{ background: 'var(--available)', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', marginBottom: 'var(--space-lg)' }}>{successMessage}</div>}

      <div className="search-filters" style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
        <div className="search-container" style={{ flex: '1 1 300px' }}>
          <span className="search-icon">🔍</span>
          <input type="text" className="search-input"
            placeholder="Buscar por materia o nombre del asesor..."
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="form-select" style={{ flex: '1 1 150px' }} value={modality} onChange={e => setModality(e.target.value)}>
          <option value="">Cualquier modalidad</option>
          <option value="presencial">Presencial</option>
          <option value="online">Online</option>
        </select>
        <select className="form-select" style={{ flex: '1 1 150px' }} value={minRating} onChange={e => setMinRating(e.target.value)}>
          <option value="">Cualquier valoración</option>
          <option value="4">⭐ 4+ Estrellas</option>
          <option value="3">⭐ 3+ Estrellas</option>
        </select>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Buscando...</p>}
      {!loading && advisors.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No se encontraron asesores con los filtros seleccionados.</p>
      )}

      <div className="cards-grid">
        {advisors.map(a => (
          <div key={a.id} className="advisory-card" onClick={() => setSelectedAdvisor(a)}>
            <div className="card-avatar">👤</div>
            <div className="card-username">{a.user?.full_name}</div>
            <div className="card-subject">{a.subject?.name}</div>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
              ⭐ {a.avg_rating} · {a.total_reviews} reseñas · {a.modality === 'ambos' ? 'Presencial/Online' : a.modality}
            </div>
            <span className="card-link">Agendar Asesoría →</span>
          </div>
        ))}
      </div>

      {selectedAdvisor && (
        <ScheduleModal 
          advisor={selectedAdvisor} 
          onClose={() => setSelectedAdvisor(null)} 
          onSuccess={handleSuccess} 
        />
      )}
    </>
  )
}
