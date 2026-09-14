# ASORA — Plataforma Digital para Asesorías Escolares

ASORA es un sistema centralizado diseñado para conectar estudiantes que necesitan apoyo académico con estudiantes de semestres avanzados (asesores) en el Instituto Tecnológico de Morelia (ITM).

## Tecnologías

- **Frontend**: React, Vite, React Router, Axios
- **Backend**: Python, Flask, SQLAlchemy, JWT, bcrypt
- **Base de Datos**: SQLite (desarrollo), PostgreSQL (producción)
- **UI/UX**: Custom CSS (Design System propio) con diseño moderno, Glassmorphism y Dark Theme.

## Estructura del Proyecto

```text
Proyecto_Asora/
├── frontend/             # Código fuente de React (Vite)
│   ├── src/
│   │   ├── components/   # Componentes reutilizables (Layout, Header, Sidebar, Modal)
│   │   ├── context/      # Contexto global de estado (AuthContext)
│   │   ├── pages/        # Vistas principales (Login, Home, Profile, Groups, Search, Sessions)
│   │   ├── services/     # Configuración de Axios e interceptores API
│   │   └── styles/       # Design System (tokens CSS, utilidades)
│   └── package.json
├── backend/              # Código fuente de Flask
│   ├── app/
│   │   ├── models/       # Modelos SQLAlchemy (User, Subject, AdvisorProfile, Session, etc.)
│   │   ├── routes/       # Endpoints de la API REST (auth, users, subjects, advisors, sessions)
│   │   └── __init__.py   # App Factory de Flask
│   ├── requirements.txt
│   └── run.py            # Entrypoint y comandos CLI
└── prototype/            # Prototipos iniciales en HTML/CSS/JS puro
```

## Requisitos Previos

- **Node.js** (v18+)
- **Python** (v3.10+)

## Instalación y Configuración (Desarrollo Local)

### 1. Configurar el Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # En Windows
pip install -r requirements.txt

# Inicializar y poblar la base de datos de prueba
python run.py init-db
python run.py seed

# Levantar el servidor en http://localhost:5000
python run.py run
```

### 2. Configurar el Frontend

Abre otra terminal:

```bash
cd frontend
npm install

# Levantar el servidor de desarrollo en http://localhost:5173
npm run dev
```

## Usuarios de Prueba Generados

El comando `seed` crea la retícula de Sistemas (38 materias) y los siguientes usuarios de prueba (contraseña para todos: `asora123`):

- **23120532**: Natalia Guadalupe Corona Camarena (Ambos)
- **23120524**: Marco Antonio Vázquez Ponce (Ambos)
- **21120100**: Carlos Hernández López (Asesor)
- **24120300**: Ana Sofía Ramírez Torres (Asesorado)

## Funcionalidades Principales Implementadas

- **Autenticación**: Registro y Login usando el Número de Control (ITM). JWT para manejo de sesiones.
- **Búsqueda Avanzada**: Búsqueda de asesores por materia, filtrado por modalidad (presencial/online) y rating.
- **Agendamiento**: Solicitud de sesiones 1 a 1 indicando fecha, hora y modalidad.
- **Gestión de Sesiones**: Flujo de vida completo (Pendiente → Confirmada → Completada/Cancelada).
- **Perfiles y Estadísticas**: Dashboard personal con tracking de horas acumuladas para liberación de créditos.
- **Grupos**: Sistema de navegación matricial para asesorías grupales calendarizadas.
