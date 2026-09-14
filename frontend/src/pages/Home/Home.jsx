import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './Home.css'

export default function Home() {
  const [subjects, setSubjects] = useState([])
  const [advisors, setAdvisors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/subjects?career=Sistemas').catch(() => ({ data: { subjects: [] } })),
      api.get('/advisors').catch(() => ({ data: { advisors: [] } })),
    ]).then(([subRes, advRes]) => {
      setSubjects(subRes.data.subjects || [])
      setAdvisors(advRes.data.advisors || [])
    }).finally(() => setLoading(false))
  }, [])

  // Static demo data for when API has no advisors yet
  const demoCards = [
    { username: 'User123', subject: 'Química' },
    { username: 'User445', subject: 'Métodos Numéricos' },
    { username: 'User777', subject: 'Física' },
    { username: 'User016', subject: 'Cálculo Integral' },
    { username: 'User578', subject: 'Redes' },
    { username: 'User356', subject: 'Software' },
    { username: 'User123', subject: 'Probabilidad y Estadística' },
    { username: 'User971', subject: 'Principios Eléctricos' },
  ]

  const demoCarousel = [
    { username: 'User111', subject: 'Graficación' },
    { username: 'User987', subject: 'Álgebra Lineal' },
    { username: 'User130', subject: 'Contabilidad' },
    { username: 'User286', subject: 'Web' },
    { username: 'User402', subject: 'Bases de Datos' },
    { username: 'User519', subject: 'Inteligencia Artificial' },
  ]

  const displayCards = advisors.length > 0
    ? advisors.map(a => ({ username: a.user?.full_name, subject: a.subject?.name, id: a.id }))
    : demoCards

  return (
    <>
      <div className="page-title-section">
        <h1 className="page-title">Asesorías Individuales</h1>
        <p className="page-subtitle">Encuentra la asesoría que necesitas con los mejores asesores</p>
      </div>

      <h2 className="section-title">Materias Disponibles</h2>

      <div className="cards-grid">
        {displayCards.map((card, i) => (
          <div key={i} className="advisory-card animate-fade-in-up"
            onClick={() => card.id ? navigate(`/buscar?advisor=${card.id}`) : navigate('/buscar')}
            style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="card-avatar">👤</div>
            <div className="card-username">{card.username}</div>
            <div className="card-subject">{card.subject}</div>
            <span className="card-link">Ver más →</span>
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="featured-section">
        <div className="featured-banner">
          <h2 className="featured-title">Cálculo Vectorial</h2>
          <p className="featured-subtitle">Asesorías grupales</p>
          <div className="carousel-dots">
            {demoCarousel.map((_, i) => (
              <span key={i} className={`carousel-dot ${i === 0 ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        <div className="carousel-container">
          <div className="carousel-track">
            {demoCarousel.map((card, i) => (
              <div key={i} className="carousel-card animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <div className="card-avatar">👤</div>
                <div className="card-username">{card.username}</div>
                <div className="card-subject">{card.subject}</div>
                <span className="card-link" onClick={() => navigate('/grupos')}>Ver más →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
