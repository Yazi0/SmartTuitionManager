import { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { Camera, CheckCircle, XCircle } from 'lucide-react'
import api from '../utils/api'

function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const handleScan = async (result) => {
    if (result) {
      try {
        setScanning(false)
        const response = await api.post('/attendance/mark/', {
          qr_data: result.text
        })
        
        setResult({
          success: true,
          message: 'Attendance marked successfully!',
          data: response.data
        })
        setError(null)
        
        setTimeout(() => {
          setResult(null)
          setScanning(true)
        }, 3000)
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to mark attendance'
        setError(errorMessage)
        setResult(null)
        
        setTimeout(() => {
          setError(null)
          setScanning(true)
        }, 3000)
      }
    }
  }
  
  const handleError = (err) => {
    console.error('QR Scanner Error:', err)
    setError('Camera error. Please check permissions.')
  }
  
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan Student QR Code</h1>
          <p className="text-gray-600">Scan student QR codes to mark attendance</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {!scanning && !result && !error && (
            <div className="text-center py-12">
              <Camera size={64} className="mx-auto text-gray-400 mb-4" />
              <button
                onClick={() => setScanning(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Start Scanning
              </button>
            </div>
          )}
          
          {scanning && (
            <div>
              <QrReader
                onResult={handleScan}
                onError={handleError}
                constraints={{ facingMode: 'environment' }}
                className="w-full"
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setScanning(false)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Stop Scanning
                </button>
              </div>
            </div>
          )}
          
          {result && result.success && (
            <div className="text-center py-12">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Success!</h2>
              <p className="text-gray-600">{result.message}</p>
              {result.data && (
                <div className="mt-4 bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold">Student: {result.data.student?.full_name}</p>
                  <p className="text-sm text-gray-600">Class: {result.data.class_attended?.name}</p>
                  <p className="text-sm text-gray-600">Time: {new Date(result.data.created_at).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <XCircle size={64} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click "Start Scanning" to activate the camera</li>
            <li>• Point your camera at the student's QR code</li>
            <li>• The system will automatically mark attendance</li>
            <li>• Parent will receive an SMS notification</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default QRScanner
