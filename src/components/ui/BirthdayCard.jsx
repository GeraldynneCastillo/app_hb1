import React from 'react';
import PropTypes from 'prop-types';
import { Briefcase, User, Mail, Cake } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Paleta de colores PASTEL para avatares
const AVATAR_COLORS = [
    { bg: '#EDE9FE', text: '#5B21B6' },
    { bg: '#DBEAFE', text: '#1D4ED8' },
    { bg: '#D1FAE5', text: '#065F46' },
    { bg: '#FEF3C7', text: '#92400E' },
    { bg: '#FCE7F3', text: '#9D174D' },
    { bg: '#E0F2FE', text: '#0369A1' },
    { bg: '#F0FDF4', text: '#166534' },
    { bg: '#FFF7ED', text: '#9A3412' },
    { bg: '#F5F3FF', text: '#4C1D95' },
    { bg: '#ECFDF5', text: '#065F46' },
    { bg: '#FEF9C3', text: '#713F12' },
    { bg: '#FFE4E6', text: '#9F1239' },
];

function getAvatarColor(nombre = '', apellido = '') {
    const seed = `${nombre}${apellido}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const MONTH_ABBREV = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
function formatBirthdayBadge(dateString) {
    if (!dateString || dateString === '[]' || dateString === 'Sin fecha') return null;
    const parts = dateString.split('/');
    if (parts.length < 2) return null;
    const day = parseInt(parts[0], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (isNaN(day) || isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return null;
    return `${day} ${MONTH_ABBREV[monthIdx]}`;
}

const BirthdayCard = ({ user, status }) => {
    const isToday = status === 'today';
    const isPast = status === 'past';
    const avatarColor = getAvatarColor(user.nombre, user.apellido);
    const birthdayBadge = formatBirthdayBadge(user.cumpleanos);

    return (
        <div
            className={cn(
                "relative bg-white border rounded-2xl p-5",
                "shadow-sm transition-all duration-300 ease-out",
                "hover:scale-[1.02] hover:shadow-xl hover:-translate-y-0.5",
                "flex flex-col overflow-hidden",
                !isToday && !isPast && "border-slate-200/80",
                isToday && "border-slate-200/80",
                isPast && "border-slate-200 opacity-60 grayscale-[0.4]"
            )}
        >


            {/* Encabezado: Avatar + Nombre + (fecha si no es hoy) */}
            <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div
                    className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white"
                    style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                >
                    {user.nombre
                        ? `${user.nombre.charAt(0)}${user.apellido ? user.apellido.charAt(0) : ''}`
                        : <User className="w-5 h-5" />}
                </div>

                {/* Nombre — ocupa todo el espacio disponible */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm leading-snug">
                        {user.nombre} {user.apellido}
                    </h3>
                </div>

                {/* Badge de fecha — siempre visible, ámbar para hoy, índigo para el resto */}
                {birthdayBadge && (
                    <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isToday
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        }`}>
                        <Cake className="w-3 h-3" />
                        {birthdayBadge}
                    </span>
                )}
            </div>

            {/* Cargo — texto completo, sin truncar */}
            <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <p className="text-xs text-slate-500 leading-normal line-clamp-1">
                    {user.cargo || 'Colaborador'}
                </p>
            </div>

            {/* Separador + Email */}
            <div className="mt-auto pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 transition-colors">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs truncate">
                        {user.email || 'correo@cmf.cl'}
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
