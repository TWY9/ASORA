import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import Groups from './pages/Groups/Groups'
import Profile from './pages/Profile/Profile'
import Search from './pages/Search/Search'
import Sessions from './pages/Sessions/Sessions'
import AdminDashboard from './pages/Admin/AdminDashboard'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Cargando...</div>
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Cargando...</div>
  return user?.role === 'admin' ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Home />} />
        <Route path="grupos" element={<Groups />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="buscar" element={<Search />} />
        <Route path="sesiones" element={<Sessions />} />
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Route>
    </Routes>
  )
}
