import { useState, useEffect, useMemo } from 'react';
import MainLayout from './components/layout/MainLayout';
import BentoGrid from './components/dashboard/BentoGrid';
import FilterBar from './components/dashboard/FilterBar';
import { getBirthdayStatusStrict, getMonthIndexFromDate } from './utils/dateUtils';


// --- CONFIGURACIÓN DINÁMICA DE API ---
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000'
  : 'http://172.19.7.106:8000';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [filterMonth, setFilterMonth] = useState('todos');
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    gerencia: '',
    jefatura: ''
  });

  const fetchUsuarios = async () => {
    setCargando(true);
    try {
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

  useEffect(() => {
    // eslint-disable-next-line
    fetchUsuarios();
  }, []);

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

  const handleReset = () => {
    setBusqueda('');
    setFiltros({ gerencia: '', jefatura: '' });
    setFilterMonth('todos');
  };

  const hasActiveFilters = useMemo(() => {
    return busqueda.trim() !== '' ||
      filtros.gerencia !== '' ||
      filtros.jefatura !== '' ||
      filterMonth !== "todos";
  }, [busqueda, filtros, filterMonth]);

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(usuario => {
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

    if (!hasActiveFilters) {
      return {
        today: usuarios
          .filter(u => getBirthdayStatusStrict(u.cumpleanos) === 'today')
          .sort(sortByProximity),
        week1: usuarios
          .filter(u => getBirthdayStatusStrict(u.cumpleanos) === 'week1')
          .sort(sortByProximity),
        all_filtered: [],
      };
    }

    const all_filtered = [...filteredUsuarios].sort((a, b) => {
      const nombreCmp = (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' });
      if (nombreCmp !== 0) return nombreCmp;
      return (a.apellido || '').localeCompare(b.apellido || '', 'es', { sensitivity: 'base' });
    });

    return {
      today: [],
      week1: [],
      all_filtered,
    };
  }, [filteredUsuarios, hasActiveFilters, usuarios]);


  return (
    <MainLayout hasActiveFilters={hasActiveFilters} onReset={handleReset}>
      <div className="font-sans text-slate-800">
        <div className="flex flex-col gap-8 mb-6 mt-8">
          <FilterBar
            search={busqueda}
            onSearchChange={setBusqueda}
            filters={filtros}
            onFilterChange={handleFilterChange}
            options={opcionesFiltro}
            selectedMonth={filterMonth}
            onMonthChange={setFilterMonth}
            resultCount={hasActiveFilters ? filteredUsuarios.length : undefined}
            hasActiveFilters={hasActiveFilters}
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
            allFilteredUsers={usersByStatus.all_filtered}
            hasActiveFilters={hasActiveFilters}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default App;