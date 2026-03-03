import React from 'react';
import PropTypes from 'prop-types';
import { Briefcase, User, Mail, Cake } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para unir clases
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Paleta de colores para avatares (fondo, texto)
const AVATAR_COLORS = [
    { bg: '#4F46E5', text: '#fff' }, // Indigo
    { bg: '#0EA5E9', text: '#fff' }, // Sky
    { bg: '#10B981', text: '#fff' }, // Emerald
    { bg: '#F59E0B', text: '#fff' }, // Amber
    { bg: '#EF4444', text: '#fff' }, // Red
    { bg: '#8B5CF6', text: '#fff' }, // Violet
    { bg: '#EC4899', text: '#fff' }, // Pink
    { bg: '#14B8A6', text: '#fff' }, // Teal
    { bg: '#F97316', text: '#fff' }, // Orange
    { bg: '#6366F1', text: '#fff' }, // Purple-blue
    { bg: '#06B6D4', text: '#fff' }, // Cyan
    { bg: '#84CC16', text: '#fff' }, // Lime
];

// Elige un color de forma determinística según el nombre completo
function getAvatarColor(nombre = '', apellido = '') {
    const seed = `${nombre}${apellido}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const BirthdayCard = ({ user, status }) => {
    const isToday = status === 'today';
    const isPast = status === 'past';

    return (
        <div
            className={cn(
                "group relative bg-white border border-slate-200/80 rounded-2xl p-5",
                "shadow-[0_2px_16px_rgba(0,0,0,0.06)]",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.13)] hover:border-indigo-200/70",
                "flex flex-col w-full",
                isPast && "opacity-60 grayscale-[0.3]"
            )}
        >

            {/* encabezado: Avatar + Nombre */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold transition-all shadow-sm"
                        style={(() => {
                            const color = getAvatarColor(user.nombre, user.apellido);
                            return { backgroundColor: color.bg, color: color.text };
                        })()}
                    >
                        {user.nombre
                            ? `${user.nombre.charAt(0)}${user.apellido ? user.apellido.charAt(0) : ''}`
                            : <User className="w-6 h-6" />}
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
