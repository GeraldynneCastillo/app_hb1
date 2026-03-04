import React from 'react';
import { Calendar } from 'lucide-react';

const MonthFilter = ({ selectedMonth, onMonthChange }) => {
    const months = [
        { value: '0', label: 'Enero' }, { value: '1', label: 'Febrero' }, { value: '2', label: 'Marzo' },
        { value: '3', label: 'Abril' }, { value: '4', label: 'Mayo' }, { value: '5', label: 'Junio' },
        { value: '6', label: 'Julio' }, { value: '7', label: 'Agosto' }, { value: '8', label: 'Septiembre' },
        { value: '9', label: 'Octubre' }, { value: '10', label: 'Noviembre' }, { value: '11', label: 'Diciembre' },
    ];

    const inputBase = "w-full bg-white/70 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all";

    return (
        <div className="relative w-full flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className={`${inputBase} pl-9 pr-4 py-2.5 appearance-none cursor-pointer`}
            >
                <option value="todos">Todos los meses</option>
                {months.map((month) => (
                    <option key={month.value} value={month.value}>
                        {month.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MonthFilter;
