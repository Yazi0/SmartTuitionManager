import { Link, useLocation } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  DollarSign, 
  BarChart3,
  GraduationCap,
  LogOut,
  Home
} from 'lucide-react'

function Sidebar({ role, onLogout }) {
  const location = useLocation()
  
  const ownerNavItems = [
    { path: '/owner', icon: Home, label: 'Dashboard' },
    { path: '/owner/students', icon: GraduationCap, label: 'Students' },
    { path: '/owner/teachers', icon: Users, label: 'Teachers' },
    { path: '/owner/classes', icon: BookOpen, label: 'Classes' },
    { path: '/owner/payments', icon: DollarSign, label: 'Payments' },
    { path: '/owner/reports', icon: BarChart3, label: 'Reports' },
    { path: '/owner/scan', icon: UserCheck, label: 'Scan QR Code' },
  ]
  
  const teacherNavItems = [
    { path: '/teacher', icon: Home, label: 'Dashboard' },
    { path: '/teacher/attendance', icon: BarChart3, label: 'Attendance' },
  ]
  
  const navItems = role === 'owner' ? ownerNavItems : teacherNavItems
  
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Smart Tuition</h1>
        <p className="text-gray-400 text-sm mt-1">{role === 'owner' ? 'Owner Portal' : 'Teacher Portal'}</p>
      </div>
      
      <nav className="flex-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
