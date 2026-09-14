import { useState, useEffect, useCallback } from 'react'
import './Groups.css'

// Static demo data from prototype
const subjectsData = [
  {
    name: 'Métodos Numéricos', advisor: 'User571 (ISC)', badge: 'presencial',
    topics: [
      { name: 'Unidad 1 — Errores', month: 'Abril — 2025',
        schedule: [['','','','','','',''],['','','','','','',''],['','Ocupado','','Ocupado','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','','']],
        modalInfo: { tema: 'Unidad 1 — Errores', fecha: 'Martes y Jueves — Abril 2025', lugar: 'Biblioteca, cubículo 3', hora: '9:00 - 10:00 am' }
      },
      { name: 'Unidad 2 — Raíces', month: 'Mayo — 2025',
        schedule: [['','','','','','',''],['','Ocupado','','','Ocupado','',''],['','','','','','',''],['','','','','','',''],['','','','Ocupado','','',''],['','','','','','',''],['','','','','','','']],
        modalInfo: { tema: 'Unidad 2 — Raíces de ecuaciones', fecha: 'Martes 5 - Mayo 2025', lugar: 'Biblioteca, cubículo 3', hora: '8:00 - 9:00 am' }
      },
    ]
  },
  {
    name: 'Graficación', advisor: 'User777 (Egresado)', badge: 'online',
    topics: [
      { name: 'Escalamiento', month: 'Mayo — 2025',
        schedule: [['','','','','','Ocupado','Ocupado'],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','','']],
        modalInfo: { tema: 'Escalamiento', fecha: 'Sábado y Domingo — Mayo 2025', lugar: 'Online — Google Meet', hora: '7:00 - 8:00 am' }
      },
    ]
  },
  {
    name: 'Cálculo Integral', advisor: 'User016 (ISC)', badge: 'presencial',
    topics: [
      { name: 'Unidad 1 — Antiderivadas', month: 'Marzo — 2025',
        schedule: [['','','','','','',''],['Ocupado','','','','Ocupado','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','','']],
        modalInfo: { tema: 'Unidad 1 — Antiderivadas', fecha: 'Lunes y Viernes — Marzo 2025', lugar: 'Edificio C, Aula 201', hora: '8:00 - 9:00 am' }
      },
    ]
  },
]

const timeSlots = ['7 - 8','8 - 9','9 - 10','10 - 11','11 - 12','12 - 1','1 - 2']
const days = ['Lunes','Martes','Miér.','Jueves','Viernes','Sábado','Domingo']

export default function Groups() {
  const [subjectIdx, setSubjectIdx] = useState(0)
  const [topicIdx, setTopicIdx] = useState(0)
  const [modal, setModal] = useState(null)

  const subject = subjectsData[subjectIdx]
  const topic = subject.topics[topicIdx]

  const navigateTopic = useCallback((dir) => {
    const next = topicIdx + dir
    if (next >= 0 && next < subject.topics.length) setTopicIdx(next)
  }, [topicIdx, subject])

  const navigateSubject = useCallback(() => {
    setSubjectIdx(prev => (prev + 1) % subjectsData.length)
    setTopicIdx(0)
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (modal) { if (e.key === 'Escape') setModal(null); return }
      if (e.key === 'ArrowLeft') navigateTopic(-1)
      if (e.key === 'ArrowRight') navigateTopic(1)
      if (e.key === 'ArrowDown') { e.preventDefault(); navigateSubject() }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [modal, navigateTopic, navigateSubject])

  const badgeClass = subject.badge === 'presencial' ? 'badge-presencial' : 'badge-online'
  const badgeIcon = subject.badge === 'presencial' ? '📍' : '🌐'
  const badgeText = subject.badge === 'presencial' ? 'Presencial' : 'Online'
  const nextSubject = subjectsData[(subjectIdx + 1) % subjectsData.length]

  return (
    <>
      <div className="groups-header">
        <div className="page-title-section" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Grupos</h1>
          <p className="page-subtitle">Asesorías grupales con calendario de disponibilidad</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary">✚ Crear nuevo grupo</button>
          <button className="btn-secondary">🔽 Filtrar</button>
        </div>
      </div>

      <div className="groups-navigation">
        {/* Subject dots */}
        <div className="subject-indicator">
          <span className="subject-indicator-text">Materia</span>
          <div className="subject-dots">
            {subjectsData.map((_, i) => (
              <div key={i} className={`subject-dot ${i === subjectIdx ? 'active' : ''}`}
                onClick={() => { setSubjectIdx(i); setTopicIdx(0) }} title={subjectsData[i].name} />
            ))}
          </div>
        </div>

        {/* Topic tabs */}
        <div className="topic-nav">
          <button className="topic-arrow" onClick={() => navigateTopic(-1)}>◀</button>
          <div className="topic-nav-track">
            {subject.topics.map((t, i) => (
              <div key={i} className={`topic-tab ${i === topicIdx ? 'active' : ''}`}
                onClick={() => setTopicIdx(i)}>{t.name}</div>
            ))}
          </div>
          <button className="topic-arrow" onClick={() => navigateTopic(1)}>▶</button>
        </div>

        {/* Group card */}
        <div className="group-content-area">
          <div className="group-card">
            <div className="group-card-header">
              <div>
                <h2 className="group-title">{subject.name}</h2>
                <div className="group-advisor">
                  <div className="group-advisor-avatar">👤</div>
                  <span>{subject.advisor}</span>
                </div>
                <div className="group-topics">Tema: {topic.name}</div>
              </div>
              <span className={`group-badge ${badgeClass}`}>{badgeIcon} {badgeText}</span>
            </div>
            <div className="schedule-container">
              <div className="schedule-month">{topic.month}</div>
              <table className="schedule-table">
                <thead><tr><th></th>{days.map(d => <th key={d}>{d}</th>)}</tr></thead>
                <tbody>
                  {timeSlots.map((time, ri) => (
                    <tr key={ri}>
                      <td className="time-col">{time}</td>
                      {days.map((_, ci) => {
                        const val = topic.schedule[ri][ci]
                        return val === 'Ocupado'
                          ? <td key={ci} className="occupied" onClick={() => setModal(topic.modalInfo)}>Ocupado</td>
                          : <td key={ci}></td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="topic-counter">Tema {topicIdx + 1} de {subject.topics.length} · {subject.name}</div>
        </div>

        {/* Switch subject */}
        <div className="subject-switch">
          <div className="subject-arrow-down" onClick={navigateSubject}>
            <span className="arrow-label">Siguiente materia</span>
            <div className="arrow-icon">▼</div>
            <span className="next-subject-preview">{nextSubject.name}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <h3 className="modal-title">Información de Asesoría</h3>
            <div className="modal-info-list">
              {[
                { icon: '📚', label: 'Asesoría', value: subject.name },
                { icon: '📝', label: 'Temas', value: modal.tema },
                { icon: '📅', label: 'Fecha', value: modal.fecha },
                { icon: subject.badge === 'presencial' ? '📍' : '🌐', label: subject.badge === 'presencial' ? 'Lugar' : 'Modalidad', value: modal.lugar },
                { icon: '🕐', label: 'Hora', value: modal.hora },
              ].map((item, i) => (
                <div key={i} className="modal-info-item">
                  <div className="modal-info-icon">{item.icon}</div>
                  <div>
                    <div className="modal-info-label">{item.label}</div>
                    <div className="modal-info-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
