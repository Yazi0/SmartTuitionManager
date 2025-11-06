import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TeacherHome from './TeacherHome'
import Reports from './Reports'

function TeacherDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="teacher" onLogout={handleLogout} />
      
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<TeacherHome />} />
          <Route path="attendance" element={<Reports />} />
        </Routes>
      </div>
    </div>
  )
}

export default TeacherDashboard
