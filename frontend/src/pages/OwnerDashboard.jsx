import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Students from './Students'
import Teachers from './Teachers'
import Classes from './Classes'
import Payments from './Payments'
import Reports from './Reports'
import QRScanner from './QRScanner'

function OwnerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="owner" onLogout={handleLogout} />
      
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<Reports />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classes" element={<Classes />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="scan" element={<QRScanner />} />
        </Routes>
      </div>
    </div>
  )
}

export default OwnerDashboard
