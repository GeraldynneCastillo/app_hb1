import React from 'react';
import { Search, Calendar, Building2, X, Users } from 'lucide-react';
import MonthFilter from './MonthFilter';

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const FilterBar = ({
    search,
    onSearchChange,
    filters,
    onFilterChange,
    options,
    selectedMonth,
    onMonthChange,
    resultCount,
    hasActiveFilters,
}) => {
    const inputBase = "w-full bg-white/70 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all";

    // Lista de badges activos
    const activeBadges = [];
    if (search.trim()) {
        activeBadges.push({
            key: 'search',
            label: `"${search.trim()}"`,
            icon: <Search className="w-3 h-3" />,
            onRemove: () => onSearchChange(''),
        });
    }
    if (selectedMonth !== 'todos') {
        activeBadges.push({
            key: 'month',
            label: MONTHS[parseInt(selectedMonth, 10)] || selectedMonth,
            icon: <Calendar className="w-3 h-3" />,
            onRemove: () => onMonthChange('todos'),
        });
    }
    if (filters.gerencia) {
        activeBadges.push({
            key: 'gerencia',
            label: filters.gerencia,
            icon: <Building2 className="w-3 h-3" />,
            onRemove: () => onFilterChange('gerencia', ''),
        });
    }
    if (filters.jefatura) {
        activeBadges.push({
            key: 'jefatura',
            label: filters.jefatura,
            icon: <Building2 className="w-3 h-3" />,
            onRemove: () => onFilterChange('jefatura', ''),
        });
    }

    return (
        <div className="flex flex-col gap-3 mb-8 w-full">
            {/* Contenedor agrupado de controles */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm p-4">
                <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">

                    {/* Búsqueda */}
                    <div className="relative flex-[2] w-full min-w-[180px]">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className={`${inputBase} pl-10 pr-3 py-2.5`}
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filtro Mes */}
                    <div className="w-full lg:w-44 flex-shrink-0">
                        <MonthFilter selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
                    </div>

                    {/* Filtro Gerencia */}
                    <div className="relative w-full lg:w-48 flex-shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-4 w-4 text-slate-400" />
                        </div>
                        <select
                            value={filters.gerencia}
                            onChange={(e) => onFilterChange('gerencia', e.target.value)}
                            className={`${inputBase} pl-9 pr-4 py-2.5 appearance-none cursor-pointer`}
                        >
                            <option value="">Gerencia (Todas)</option>
                            {options.gerencias.map((g, i) => (
                                <option key={i} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro Jefatura */}
                    <div className="relative w-full lg:w-48 flex-shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-4 w-4 text-slate-400" />
                        </div>
                        <select
                            value={filters.jefatura}
                            onChange={(e) => onFilterChange('jefatura', e.target.value)}
                            className={`${inputBase} pl-9 pr-4 py-2.5 appearance-none cursor-pointer`}
                        >
                            <option value="">Jefatura (Todas)</option>
                            {options.jefaturas.map((j, i) => (
                                <option key={i} value={j}>{j}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Badges de filtros activos + contador */}
                {(activeBadges.length > 0 || hasActiveFilters) && (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">

                        {/* Badges */}
                        {activeBadges.map((badge) => (
                            <span
                                key={badge.key}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold"
                            >
                                {badge.icon}
                                {badge.label}
                                <button
                                    onClick={badge.onRemove}
                                    className="ml-0.5 text-indigo-400 hover:text-indigo-700 transition-colors"
                                    title="Eliminar filtro"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}

                        {/* Contador solamente */}
                        {typeof resultCount === 'number' && (
                            <div className="ml-auto flex items-center">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                    {resultCount === 0
                                        ? 'Sin resultados'
                                        : resultCount === 1
                                            ? '1 colaborador encontrado'
                                            : `${resultCount} colaboradores encontrados`}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
