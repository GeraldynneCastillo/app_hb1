import React from 'react';
import { Calendar } from 'lucide-react';
const MonthFilter = ({ selectedMonth, onMonthChange }) => {
    const months = [
        { value: '0', label: 'Enero' }, { value: '1', label: 'Febrero' }, { value: '2', label: 'Marzo' },
        { value: '3', label: 'Abril' }, { value: '4', label: 'Mayo' }, { value: '5', label: 'Junio' },
        { value: '6', label: 'Julio' }, { value: '7', label: 'Agosto' }, { value: '8', label: 'Septiembre' },
        { value: '9', label: 'Octubre' }, { value: '10', label: 'Noviembre' }, { value: '11', label: 'Diciembre' },
    ];

    const commonStyles = "w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

    return (
        <div className="relative w-full lg:w-40 flex-shrink-0">
            <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className={`${commonStyles} pl-3 pr-8 py-2.5 appearance-none cursor-pointer`}
            >
                <option value="todos">Todos los meses</option>
                {months.map((month) => (
                    <option key={month.value} value={month.value}>
                        {month.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Calendar className="h-3 w-3 text-slate-400" />
            </div>
        </div>
    );
};

export default MonthFilter;
