import React from 'react';
import { Calendar } from 'lucide-react';
const MonthFilter = ({ selectedMonth, onMonthChange }) => {
    const months = [
        { value: '0', label: 'Enero' }, { value: '1', label: 'Febrero' }, { value: '2', label: 'Marzo' },
        { value: '3', label: 'Abril' }, { value: '4', label: 'Mayo' }, { value: '5', label: 'Junio' },
        { value: '6', label: 'Julio' }, { value: '7', label: 'Agosto' }, { value: '8', label: 'Septiembre' },
        { value: '9', label: 'Octubre' }, { value: '10', label: 'Noviembre' }, { value: '11', label: 'Diciembre' },
    ];

    return (
        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-full md:w-auto min-w-[240px]">
            <Calendar className="w-5 h-5 text-slate-400 mr-3" />
            <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="w-full bg-transparent border-none text-slate-700 font-medium text-sm focus:ring-0 cursor-pointer outline-none"
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
