import React from 'react';
import { Search, Filter } from 'lucide-react';

const FilterBar = ({
    search,
    onSearchChange,
    filters,
    onFilterChange,
    options
}) => {
    // Estilos comunes para inputs y selects
    const commonStyles = "w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center w-full"> {/* Removed container background/shadow */}
            {/* Input de Búsqueda */}
            <div className="relative flex-grow w-full lg:w-auto min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    className={`${commonStyles} pl-10 pr-3 py-2.5`}
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filtro Cargo */}
            <div className="relative w-full lg:w-auto min-w-[150px]">
                <select
                    value={filters.cargo}
                    onChange={(e) => onFilterChange('cargo', e.target.value)}
                    className={`${commonStyles} pl-3 pr-8 py-2.5 appearance-none cursor-pointer`}
                >
                    <option value="">Cargo (Todos)</option>
                    {options.cargos.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Filter className="h-3 w-3 text-slate-400" />
                </div>
            </div>

            {/* Filtro Gerencia */}
            <div className="relative w-full lg:w-auto min-w-[150px]">
                <select
                    value={filters.gerencia}
                    onChange={(e) => onFilterChange('gerencia', e.target.value)}
                    className={`${commonStyles} pl-3 pr-8 py-2.5 appearance-none cursor-pointer`}
                >
                    <option value="">Gerencia (Todas)</option>
                    {options.gerencias.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                    ))}
                </select>
            </div>

            {/* Filtro Jefatura */}
            <div className="relative w-full lg:w-auto min-w-[150px]">
                <select
                    value={filters.jefatura}
                    onChange={(e) => onFilterChange('jefatura', e.target.value)}
                    className={`${commonStyles} pl-3 pr-8 py-2.5 appearance-none cursor-pointer`}
                >
                    <option value="">Jefatura (Todas)</option>
                    {options.jefaturas.map((j, i) => (
                        <option key={i} value={j}>{j}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
