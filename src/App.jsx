import { useState, useEffect } from 'react'

function App() {
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(false)

  const fetchUsuarios = async (nombre = '*') => {
    setCargando(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios/?q=${nombre}`)
      const data = await response.json()
      setUsuarios(data.trabajadores)
    } catch (error) {
      console.error("Error al conectar con el servidor", error)
    }
    setCargando(false)
  }

  useEffect(() => { fetchUsuarios() }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-left">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Directorio Corporativo</h1>
        
        <div className="flex gap-2 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <input 
            type="text" 
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Buscar por usuario o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button 
            onClick={() => fetchUsuarios(busqueda)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {cargando ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {usuarios.map((u, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all">
              <p className="font-bold text-lg text-gray-800">{u.nombre} {u.apellido}</p>
              <p className="text-blue-600 text-sm font-semibold uppercase">{u.cargo}</p>
              <p className="text-gray-500 text-sm mt-2">{u.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App