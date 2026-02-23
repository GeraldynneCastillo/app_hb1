import { useState, useEffect, useMemo } from 'react';
import MainLayout from './components/layout/MainLayout';
import BentoGrid from './components/dashboard/BentoGrid';
import MonthFilter from './components/dashboard/MonthFilter';
import FilterBar from './components/dashboard/FilterBar';
import { getBirthdayStatusStrict, getMonthIndexFromDate } from './utils/dateUtils';


// --- CONFIGURACIÓN DINÁMICA DE API ---
// Si accedes por localhost, usa localhost. Si accedes por IP, usa la IP.
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000'
  : 'http://172.19.7.106:8000';

function App() {
  // Estado para datos y UI
  const [usuarios, setUsuarios] = useState([]);
  const [filterMonth, setFilterMonth] = useState('todos');
  const [cargando, setCargando] = useState(false);

  // Estados para nuevos filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    gerencia: '',
    jefatura: ''
  });



  // Función asíncrona para obtener datos
  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      // Usamos la URL dinámica configurada arriba
      const response = await fetch(`${API_BASE_URL}/api/usuarios/?q=`);
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

  // Cargar usuarios al inicio
  useEffect(() => {
    // eslint-disable-next-line
    fetchUsuarios();
  }, []);

  // --- LÓGICA DE FILTRADO Y PROCESAMIENTO ---

  const opcionesFiltro = useMemo(() => {
    const unicos = (key) => [...new Set(usuarios.map(u => u[key]).filter(Boolean))].sort();
    return {
      gerencias: unicos('gerencia'),
      jefaturas: unicos('jefatura')
    };
  }, [usuarios]);

  const handleFilterChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const usersToday = useMemo(() => {
    return usuarios.filter(u => getBirthdayStatusStrict(u.cumpleanos) === 'today');
  }, [usuarios]);

  const usersPast = useMemo(() => {
    return usuarios.filter(u => getBirthdayStatusStrict(u.cumpleanos) === 'past');
  }, [usuarios]);

  const hasActiveFilters = useMemo(() => {
    return busqueda.trim() !== '' ||
      filtros.gerencia !== '' ||
      filtros.jefatura !== '' ||
      filterMonth !== "todos"; // asumiendo que el filtro de mes también cuenta
  }, [busqueda, filtros, filterMonth]);

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(usuario => {
      // Si no hay filtros activos, solo se mostrará la sección de "Hoy", así que el resto retorna false.
      // Modificamos esto más abajo en usersByStatus para manejar secciones.
      const searchLower = busqueda.toLowerCase().trim();
      const matchesSearch = searchLower === '' ||
        usuario.nombre?.toLowerCase().includes(searchLower) ||
        usuario.apellido?.toLowerCase().includes(searchLower);

      const userMonthIndex = getMonthIndexFromDate(usuario.cumpleanos);
      const matchesMonth = filterMonth === "todos" || userMonthIndex.toString() === filterMonth;

      const matchesGerencia = !filtros.gerencia || usuario.gerencia === filtros.gerencia;
      const matchesJefatura = !filtros.jefatura || usuario.jefatura === filtros.jefatura;

      return matchesSearch && matchesMonth && matchesGerencia && matchesJefatura;
    });
  }, [usuarios, busqueda, filterMonth, filtros]);

  const usersByStatus = useMemo(() => {
    const groups = {
      today: [],
      week1: [],
      week2: [],
      week3: [],
      future: [],
      past: [],
      all_filtered: [] // Añadimos una lista plana de todos los filtrados para paginación si se requiere
    };

    if (!hasActiveFilters) {
      groups.today = usersToday;
      groups.past = usersPast;
      groups.week1 = usuarios.filter(u => getBirthdayStatusStrict(u.cumpleanos) === 'week1');
    } else {
      filteredUsuarios.forEach(u => {
        const status = getBirthdayStatusStrict(u.cumpleanos);

        if (status === 'past') groups.past.push(u);
        else if (status === 'week1' || status === 'today') groups.week1.push(u);
        else if (status === 'week2') groups.week2.push(u);
        else if (status === 'week3') groups.week3.push(u);
        else if (status === 'future') groups.future.push(u);

        groups.all_filtered.push(u);
      });
    }


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortByProximity = (a, b) => {
      const parseFecha = (str) => {
        const [d, m] = str.split('/').map(Number);
        const fecha = new Date(today.getFullYear(), m - 1, d);
        if (fecha < today) fecha.setFullYear(today.getFullYear() + 1);
        return fecha;
      };
      return parseFecha(a.cumpleanos) - parseFecha(b.cumpleanos);
    };

    Object.keys(groups).forEach(key => {
      groups[key].sort(sortByProximity);
    });

    return groups;
  }, [filteredUsuarios, usersToday, usersPast, hasActiveFilters, usuarios]);



  return (
    <MainLayout>
      <div className="font-sans text-slate-800">
        <div className="flex flex-col gap-6 mb-4 mt-0">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Cumpleaños</h2>
              <p className="text-slate-500 mt-1">Busca y filtra entre todos los colaboradores</p>
            </div>
            <MonthFilter selectedMonth={filterMonth} onMonthChange={setFilterMonth} />
          </div>

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
            allFilteredUsers={usersByStatus.all_filtered}
            hasActiveFilters={hasActiveFilters}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default App;