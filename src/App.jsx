import { useState, useEffect } from 'react';
import { 
  Search, Users, Mail, Briefcase, Cake, 
  Calendar, Building2, UserCircle, Send 
} from 'lucide-react';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [cargando, setCargando] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios/?q=${busqueda.trim()}`);
      const data = await response.json();
      
      const listaLimpia = (data.trabajadores || []).filter(
        u => u && u.nombre && u.nombre !== "" && u.nombre !== "[]" && u.nombre !== "No registrado"
      ).map(u => ({
          ...u,
          userId: `${u.nombre}_${u.apellido}_${u.email}`
      }));
      
      setUsuarios(listaLimpia);
    } catch (error) {
      console.error("Error al conectar con el servidor", error);
      setUsuarios([]);
    }
    setCargando(false);
  };

  // --- LÓGICA DE SELECCIÓN ---
  const toggleSeleccion = (usuario) => {
    const email = usuario.email;
    if (!email || email === "[]" || email === "Sin correo") return;
    
    setSeleccionados(prev => {
      const existe = prev.find(u => u.email === email);
      if (existe) {
        return prev.filter(u => u.email !== email);
      } else {
        return [...prev, { email: email, nombre: usuario.nombre }];
      }
    });
  };

  const toggleSeleccionarTodo = () => {
    const todosVisiblesValidos = sortedUsuarios
        .filter(u => u.email && u.email !== "[]" && u.email !== "Sin correo")
        .map(u => ({ email: u.email, nombre: u.nombre }));

    const estanTodosSeleccionados = todosVisiblesValidos.length > 0 && 
      todosVisiblesValidos.every(v => seleccionados.some(s => s.email === v.email));

    if (estanTodosSeleccionados) {
      setSeleccionados([]); 
    } else {
      setSeleccionados(todosVisiblesValidos);
    }
  };

  const enviarCorreos = async () => {
    if (seleccionados.length === 0) return;
    if (!confirm(`¿Enviar saludo personalizado a las ${seleccionados.length} personas seleccionadas?`)) return;

    setEnviando(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/enviar-seleccionados/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarios: seleccionados })
      });
      const data = await response.json();
      alert(data.mensaje);
      setSeleccionados([]); 
    } catch (error) {
      alert("Error al intentar enviar los correos.");
    }
    setEnviando(false);
  };

  // --- FUNCIONES DE FECHAS ---
  const getMonthFromDate = (dateString) => {
    if (!dateString || dateString === "" || dateString === "[]") return null;
    const parts = dateString.split('/');
    return parts.length >= 2 ? parseInt(parts[1], 10) : null;
  };

  const getDaysUntilBirthday = (dateString) => {
    if (!dateString || dateString === "" || dateString === "[]") return 999;
    const parts = dateString.split('/');
    if (parts.length < 2) return 999;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    
    const today = new Date();
    let birthday = new Date(today.getFullYear(), month - 1, day);
    if (birthday < today) birthday = new Date(today.getFullYear() + 1, month - 1, day);
    return Math.ceil((birthday - today) / (1000 * 60 * 60 * 24));
  };

  // --- FILTROS ---
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = busqueda.trim() === '' ||
      usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.jefatura?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.cargo?.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchesMonth = !filterMonth || getMonthFromDate(usuario.cumpleanos)?.toString() === filterMonth;
    return matchesSearch && matchesMonth;
  });

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => 
    getDaysUntilBirthday(a.cumpleanos) - getDaysUntilBirthday(b.cumpleanos)
  );

  const months = [
    { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' }, { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' }, { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' }, { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' }, { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg"><Users className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CMF Cumpleaños</h1>
              <p className="text-sm text-gray-500 font-medium">Panel de Gestión</p>
            </div>
          </div>

          {seleccionados.length > 0 && (
            <button 
              onClick={enviarCorreos}
              disabled={enviando}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-lg transition-all transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="font-semibold">{enviando ? 'Enviando...' : `Saludar a ${seleccionados.length} personas`}</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-[95%] mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* BARRA DE BÚSQUEDA Y FILTROS */}
          <div className="p-6 bg-gray-50/50 border-b border-gray-200 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, cargo o jefatura..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsuarios()}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
              >
                <option value="">Todos los meses</option>
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <button 
                onClick={fetchUsuarios} 
                className="px-6 py-2.5 bg-gray-800 text-white font-semibold rounded-xl hover:bg-black transition-colors"
              >
                Refrescar
              </button>
            </div>
          </div>

          {/* TABLA DE RESULTADOS */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100/50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-center w-16">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onChange={toggleSeleccionarTodo}
                      checked={seleccionados.length > 0 && seleccionados.length === sortedUsuarios.filter(u => u.email && u.email !== "Sin correo").length}
                    />
                  </th>
                  <th className="px-6 py-4">Empleado</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Cumpleaños</th>
                  <th className="px-6 py-4">Gerencia / Jefatura</th>
                  <th className="px-6 py-4">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargando ? (
                  <tr><td colSpan="6" className="text-center py-20 text-gray-400">Cargando colaboradores...</td></tr>
                ) : sortedUsuarios.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-20 text-gray-400">No se encontraron resultados</td></tr>
                ) : (
                  sortedUsuarios.map((u, i) => {
                    const tieneCorreo = u.email && u.email !== "Sin correo";
                    const estaSeleccionado = seleccionados.some(s => s.email === u.email);

                    return (
                      <tr key={i} className={`hover:bg-blue-50/30 transition-colors ${estaSeleccionado ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={!tieneCorreo}
                            checked={estaSeleccionado}
                            onChange={() => toggleSeleccion(u)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{u.nombre} {u.apellido}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                            {u.cargo}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm font-medium text-blue-600">
                            <Cake className="w-4 h-4 mr-2 text-pink-500" />
                            {u.cumpleanos || 'No reg.'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-700">{u.gerencia}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-0.5">
                            <UserCircle className="w-3 h-3 mr-1" />
                            Jefe: {u.jefatura}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-4 h-4 mr-2" />
                            {u.email}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;