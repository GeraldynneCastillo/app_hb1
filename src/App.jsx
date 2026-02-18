import { useState, useEffect, useMemo } from 'react';
import { Send } from 'lucide-react';
import MainLayout from './components/layout/MainLayout';
import DashboardHeader from './components/dashboard/DashboardHeader';
import BentoGrid from './components/dashboard/BentoGrid';
import MonthFilter from './components/dashboard/MonthFilter';
import FilterBar from './components/dashboard/FilterBar';
import { getBirthdayStatusStrict, getCurrentMonthIndex, getMonthIndexFromDate } from './utils/dateUtils';
import { motion } from 'framer-motion';

function App() {
  // Estado para datos y UI
  const [usuarios, setUsuarios] = useState([]);
  const [filterMonth, setFilterMonth] = useState('todos');
  const [cargando, setCargando] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // Estados para nuevos filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    cargo: '',
    gerencia: '',
    jefatura: ''
  });

  // Cargar usuarios al inicio
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Función asíncrona para obtener datos
  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      // Nota: La búsqueda del backend podría usarse, pero aquí filtraremos en cliente también
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios/?q=`);
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

  // --- LÓGICA DE FILTRADO Y PROCESAMIENTO ---

  // Obtener opciones únicas para los dropdowns
  const opcionesFiltro = useMemo(() => {
    const unicos = (key) => [...new Set(usuarios.map(u => u[key]).filter(Boolean))].sort();
    return {
      cargos: unicos('cargo'),
      gerencias: unicos('gerencia'),
      jefaturas: unicos('jefatura')
    };
  }, [usuarios]);

  // Manejar cambio en filtros
  const handleFilterChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  // 1. LISTA "HOY" (Independiente de filtros)
  // Muestra SIEMPRE los cumpleaños de hoy, sin importar qué mes se esté viendo
  const usersToday = useMemo(() => {
    return usuarios.filter(u => getBirthdayStatusStrict(u.cumpleanos) === 'today');
  }, [usuarios]);

  // Auto-seleccionar mes actual si hay cumpleaños este mes y no se ha interactuado
  useEffect(() => {
    if (usuarios.length > 0 && !cargando) {
      // Si hay cumpleaños hoy, o en el mes actual, se podría preseleccionar.
      // El requerimiento dice: "Si hay cumpleaños en el mes actual → seleccionar ese mes autom. Si no → 'todos'"
      const currentMonthIndex = getCurrentMonthIndex(); // 0-11
      const hasBirthdaysThisMonth = usuarios.some(u => getMonthIndexFromDate(u.cumpleanos) === currentMonthIndex);

      if (hasBirthdaysThisMonth) {
        setFilterMonth(currentMonthIndex.toString());
      } else {
        setFilterMonth("todos");
      }
    }
  }, [usuarios.length, cargando]);


  // 2. LISTA FILTRADA (Para el resto de secciones)
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(usuario => {
      // 0. EXCLUSIÓN DE CUMPLEAÑOS DE HOY
      // Los que cumplen hoy ya tienen su sección dedicada. No deben aparecer en búsquedas ni listados futuros.
      if (getBirthdayStatusStrict(usuario.cumpleanos) === 'today') return false;

      // A. Filtro de Texto (Nombre, Apellido) - Case insensitive
      const searchLower = busqueda.toLowerCase().trim();
      const matchesSearch = searchLower === '' ||
        usuario.nombre?.toLowerCase().includes(searchLower) ||
        usuario.apellido?.toLowerCase().includes(searchLower);

      // B. Filtro de Mes (Puede ser "todos" o un número "0".."11")
      const userMonthIndex = getMonthIndexFromDate(usuario.cumpleanos);
      const matchesMonth = filterMonth === "todos" || userMonthIndex.toString() === filterMonth;

      // C. Filtros Dropdowns
      const matchesCargo = !filtros.cargo || usuario.cargo === filtros.cargo;
      const matchesGerencia = !filtros.gerencia || usuario.gerencia === filtros.gerencia;
      const matchesJefatura = !filtros.jefatura || usuario.jefatura === filtros.jefatura;

      return matchesSearch && matchesMonth && matchesCargo && matchesGerencia && matchesJefatura;
    });
  }, [usuarios, busqueda, filterMonth, filtros]);


  // Clasificación por Secciones para el BentoGrid
  const usersByStatus = useMemo(() => {
    // Si estamos viendo "todos", usamos la lógica de semanas
    // Si estamos viendo un mes específico, mostramos todo plano o agrupado por día

    // Estructura base
    const groups = {
      today: usersToday, // Siempre viene de la lista separada
      week1: [],
      week2: [],
      week3: [],
      future: [],
      past: []
    };

    filteredUsuarios.forEach(u => {
      // Excluir los que ya están en "today" para no duplicar visualmente en otras secciones
      // (Opcional, pero se ve mejor si no se repiten)
      if (getBirthdayStatusStrict(u.cumpleanos) === 'today') return;

      const status = getBirthdayStatusStrict(u.cumpleanos);

      // Si el filtro es "todos", respetamos la lógica de semanas relativa a HOY
      // Si el filtro es un mes específico, tal vez queramos ver todo el mes junto.
      // Por consistencia con el pedido "Todos -> Enero -> Febrero", trataremos de agrupar.

      if (status === 'past') {
        groups.past.push(u);
      } else if (status === 'week1') {
        groups.week1.push(u);
      } else if (status === 'week2') {
        groups.week2.push(u);
      } else if (status === 'week3') {
        groups.week3.push(u);
      } else {
        // 'future' o 'unknown'
        groups.future.push(u);
      }
    });

    // Ordenar por día dentro de cada grupo
    const sortByDay = (a, b) => {
      const dayA = parseInt(a.cumpleanos.split('/')[0]) || 0;
      const dayB = parseInt(b.cumpleanos.split('/')[0]) || 0;
      return dayA - dayB;
    };

    Object.keys(groups).forEach(key => {
      groups[key].sort(sortByDay);
    });

    return groups;
  }, [filteredUsuarios, usersToday]);

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


  return (
    <MainLayout
      headerActions={seleccionados.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          onClick={enviarCorreos}
          disabled={enviando}
          className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-lg">
            {enviando ? 'Enviando...' : `Saludar a ${seleccionados.length} personas`}
          </span>
        </motion.button>
      )}
    >
      <div className="font-sans text-slate-800"> {/* Contenedor sin fondo para respetar el MainLayout */}
        <DashboardHeader countToday={usersByStatus.today.length} />

        {/* BARRA DE FILTROS Y NAVEGACIÓN */}
        <div className="flex flex-col gap-6 mb-12">

          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Explorar Cumpleaños</h2>
              <p className="text-slate-500 mt-1">Busca y filtra entre todos los colaboradores</p>
            </div>

            {/* Filtro de Mes - Diseño Clean */}
            <MonthFilter selectedMonth={filterMonth} onMonthChange={setFilterMonth} />
          </div>

          {/* Barra Horizontal de Filtros - Integrada */}
          <FilterBar
            search={busqueda}
            onSearchChange={setBusqueda}
            filters={filtros}
            onFilterChange={handleFilterChange}
            options={opcionesFiltro}
          />
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 font-medium text-lg">Cargando directorio...</p>
          </div>
        ) : (
          <BentoGrid
            todayUsers={usersByStatus.today}
            week1Users={usersByStatus.week1}
            week2Users={usersByStatus.week2}
            week3Users={usersByStatus.week3}
            futureUsers={usersByStatus.future}
            pastUsers={usersByStatus.past}
            selectedUsers={seleccionados}
            toggleSelection={toggleSeleccion}
            sending={enviando}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default App;