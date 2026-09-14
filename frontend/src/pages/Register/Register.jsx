import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../Login/Login.css'

const CAREERS = [
  'Ingeniería en Sistemas Computacionales',
  'Ingeniería Industrial',
  'Ingeniería Electrónica',
  'Ingeniería Eléctrica',
  'Ingeniería Mecánica',
  'Ingeniería Química',
  'Ingeniería en Gestión Empresarial',
  'Ingeniería Civil',
  'Arquitectura',
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    control_number: '',
    password: '',
    confirm_password: '',
    full_name: '',
    career: CAREERS[0],
    semester: 1,
    role: 'asesorado',
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const nextStep = () => {
    setError('')
    if (step === 1) {
      if (!form.control_number || form.control_number.length !== 8) {
        setError('El número de control debe tener 8 dígitos')
        return
      }
      if (!form.password || form.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        return
      }
      if (form.password !== form.confirm_password) {
        setError('Las contraseñas no coinciden')
        return
      }
    }
    if (step === 2 && !form.full_name.trim()) {
      setError('El nombre completo es requerido')
      return
    }
    setStep(s => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { confirm_password, ...data } = form
      await register(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">ASORA</div>
          <p className="auth-subtitle">Crea tu cuenta</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="step-indicator">
            {[1, 2, 3].map(s => (
              <span key={s} className={`step-dot ${s === step ? 'active' : s < step ? 'completed' : ''}`} />
            ))}
          </div>

          {error && <div className="auth-error">{error}</div>}

          {step === 1 && (
            <>
              <h2 className="auth-title">Credenciales</h2>
              <div className="form-group">
                <label className="form-label">Número de Control</label>
                <input type="text" className="form-input" placeholder="Ej: 23120532"
                  value={form.control_number} onChange={e => update('control_number', e.target.value)}
                  maxLength={8} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-input" placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={e => update('password', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar Contraseña</label>
                <input type="password" className="form-input" placeholder="Repite tu contraseña"
                  value={form.confirm_password} onChange={e => update('confirm_password', e.target.value)} required />
              </div>
              <button type="button" className="btn-primary auth-submit" onClick={nextStep}>Siguiente →</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="auth-title">Datos Personales</h2>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input type="text" className="form-input" placeholder="Tu nombre completo"
                  value={form.full_name} onChange={e => update('full_name', e.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Carrera</label>
                  <select className="form-select" value={form.career} onChange={e => update('career', e.target.value)}>
                    {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semestre</label>
                  <select className="form-select" value={form.semester} onChange={e => update('semester', parseInt(e.target.value))}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(s => <option key={s} value={s}>{s}° Semestre</option>)}
                  </select>
                </div>
              </div>
              <div className="auth-steps-nav">
                <button type="button" className="btn-back" onClick={() => setStep(1)}>← Atrás</button>
                <button type="button" className="btn-primary auth-submit" onClick={nextStep} style={{flex:1}}>Siguiente →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="auth-title">Tipo de Cuenta</h2>
              <div className="form-group">
                <label className="form-label">¿Cómo usarás ASORA?</label>
                {[
                  { value: 'asesorado', label: '📖 Asesorado', desc: 'Buscar y recibir asesorías' },
                  { value: 'asesor', label: '🎓 Asesor', desc: 'Dar asesorías en materias que domino' },
                  { value: 'both', label: '📚 Ambos', desc: 'Dar y recibir asesorías' },
                ].map(opt => (
                  <div key={opt.value}
                    className={`role-option ${form.role === opt.value ? 'active' : ''}`}
                    onClick={() => update('role', opt.value)}>
                    <span className="role-label">{opt.label}</span>
                    <span className="role-desc">{opt.desc}</span>
                  </div>
                ))}
              </div>
              <div className="auth-steps-nav">
                <button type="button" className="btn-back" onClick={() => setStep(2)}>← Atrás</button>
                <button type="submit" className="btn-primary auth-submit" disabled={loading} style={{flex:1}}>
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
              </div>
            </>
          )}

          <p className="auth-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
