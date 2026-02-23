import React from 'react';
import PropTypes from 'prop-types';
import { Briefcase, User, Mail, Cake } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para unir clases
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const BirthdayCard = ({ user, status }) => {
    const isToday = status === 'today';
    const isPast = status === 'past';

    return (
        <div
            className={cn(
                "group relative bg-white border border-slate-300 rounded-2xl p-5 shadow-lg transition-all duration-300 ease-out",
                "hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200",
                "flex flex-col w-full",
                isPast && "opacity-60 grayscale-[0.3]"
            )}
        >

            {/* encabezado: Avatar + Nombre */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold transition-all",
                        isToday
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                    )}>
                        {user.nombre ? user.nombre.charAt(0) : <User className="w-6 h-6" />}
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-blue-700 transition-colors break-words">
                        {user.nombre} {user.apellido}
                    </h3>
                </div>
            </div>

            {/* Información completa */}
            <div className="space-y-3 mt-auto">
                {/* Cargo */}
                <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600 font-medium leading-normal break-words line-clamp-2 pr-2">
                        {user.cargo || "Colaborador"}
                    </p>
                </div>
                {/* Fecha */}
                <div className="flex items-center gap-2">
                    <Cake className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <p className="text-sm font-bold text-slate-500 group-hover:text-blue-500 transition-colors">
                        {user.cumpleanos}
                    </p>
                </div>
            </div>

            {/* separador + correo */}
            <div className="pt-3 mt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">
                        {user.email || "correo@cmf.cl"}
                    </span>
                </div>
            </div>
        </div>
    );
};

BirthdayCard.propTypes = {
    user: PropTypes.shape({
        nombre: PropTypes.string,
        apellido: PropTypes.string,
        cargo: PropTypes.string,
        gerencia: PropTypes.string,
        jefatura: PropTypes.string,
        email: PropTypes.string,
        cumpleanos: PropTypes.string,
    }).isRequired,
    status: PropTypes.string,
};

export default BirthdayCard;
