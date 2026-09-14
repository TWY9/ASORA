import { useState, useEffect } from 'react'
import api from '../../services/api'
import './ApplyAdvisorModal.css'

export default function ApplyAdvisorModal({ onClose, onSuccess }) {
  const [subjects, setSubjects] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [modality, setModality] = useState('presencial')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch all subjects so the user can choose one
    api.get('/subjects')
      .then(res => setSubjects(res.data.subjects || []))
      .catch(() => setSubjects([]))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!subjectId) return setError('Selecciona una materia')
    if (!file) return setError('Debes subir un archivo como evidencia')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('subject_id', subjectId)
      formData.append('modality', modality)
      formData.append('kardex', file)
      // schedule_availability could be added here later

      await api.post('/advisors/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 500 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">Convertirme en Asesor</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', fontSize: 'var(--font-sm)' }}>
          Envía tu solicitud para dar asesorías. El administrador revisará tu evidencia antes de aprobarte.
        </p>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error" style={{ padding: 'var(--space-sm)' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Materia</label>
            <select className="form-select" value={subjectId} onChange={e => setSubjectId(e.target.value)}>
              <option value="">Selecciona una materia</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.semester}° Semestre)</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Modalidad que ofreces</label>
            <select className="form-select" value={modality} onChange={e => setModality(e.target.value)}>
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="ambos">Ambos (Presencial y Online)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Evidencia (Kardex o Carta)</label>
            <div className="file-upload-wrapper">
              <input 
                type="file" 
                className="form-input" 
                accept=".pdf,.png,.jpg,.jpeg" 
                onChange={e => setFile(e.target.files[0])}
                style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-sm)' }}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Formatos permitidos: PDF, PNG, JPG
              </p>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-lg)' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>
    </div>
  )
}
