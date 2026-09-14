import { useState } from 'react'
import api from '../../services/api'
import './ScheduleModal.css'

export default function ScheduleModal({ advisor, onClose, onSuccess }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [modality, setModality] = useState(advisor.modality === 'ambos' ? 'presencial' : advisor.modality)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString()
      await api.post('/sessions', {
        advisor_profile_id: advisor.id,
        scheduled_at: scheduledAt,
        modality: modality,
        duration_minutes: 60,
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agendar la sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">Agendar Asesoría</h3>
        
        <div className="modal-info-list" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="modal-info-item">
            <div className="modal-info-icon">📚</div>
            <div>
              <div className="modal-info-label">Materia</div>
              <div className="modal-info-value">{advisor.subject?.name}</div>
            </div>
          </div>
          <div className="modal-info-item">
            <div className="modal-info-icon">👤</div>
            <div>
              <div className="modal-info-label">Asesor</div>
              <div className="modal-info-value">{advisor.user?.full_name}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error" style={{ padding: 'var(--space-sm)' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input type="date" className="form-input" required value={date} onChange={e => setDate(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Hora</label>
            <input type="time" className="form-input" required value={time} onChange={e => setTime(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Modalidad</label>
            <select className="form-select" value={modality} onChange={e => setModality(e.target.value)}>
              {(advisor.modality === 'presencial' || advisor.modality === 'ambos') && <option value="presencial">Presencial</option>}
              {(advisor.modality === 'online' || advisor.modality === 'ambos') && <option value="online">Online</option>}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }} disabled={loading}>
            {loading ? 'Agendando...' : 'Confirmar Cita'}
          </button>
        </form>
      </div>
    </div>
  )
}
