import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function OwnerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Smart Tuition Manager - Owner Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.first_name || user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">Coming Soon</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Classes</h3>
            <p className="text-3xl font-bold text-green-600">Coming Soon</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Monthly Income</h3>
            <p className="text-3xl font-bold text-purple-600">Coming Soon</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Student Management (Add, Edit, Delete)</li>
            <li>✓ Teacher Management</li>
            <li>✓ Class Management</li>
            <li>✓ QR Code Generation for Students</li>
            <li>✓ Payment Tracking</li>
            <li>✓ Attendance Reports</li>
            <li>✓ SMS Notifications</li>
            <li className="text-blue-600 font-semibold mt-4">Full functionality will be implemented in the next phase.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default OwnerDashboard
