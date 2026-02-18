import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Mail, Check, Briefcase, User, Building2, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para unir clases
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const BirthdayCard = ({ user, status, onSelect, isSelected, sending }) => {
    const isToday = status === 'today';
    const isPast = status === 'past';

    const variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={cn(
                "group relative bg-white border border-slate-300 rounded-2xl p-5 shadow-lg cursor-pointer transition-all duration-300 ease-out",
                "hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200",
                "flex flex-col w-full",
                isSelected && "ring-2 ring-blue-500 bg-blue-50/30",
                isPast && "opacity-60 grayscale-[0.3]"
            )}
            onClick={() => onSelect(user)}
        >
            {/* Badge de fecha - esquina superior derecha */}
            <div className="absolute top-4 right-4 z-10">
                {isToday ? (
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-md">
                        HOY
                    </div>
                ) : (
                    <span className="text-sm font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                        {user.cumpleanos}
                    </span>
                )}
            </div>

            {/* Check de selección */}
            <div className={cn(
                "absolute top-4 right-20 transition-all duration-300",
                isSelected ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}>
                <div className="bg-blue-600 text-white rounded-full p-1 shadow-md">
                    <Check className="w-4 h-4" />
                </div>
            </div>

            {/* Encabezado: Avatar + Nombre */}
            <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                    "w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold transition-all",
                    isToday
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                )}>
                    {user.nombre ? user.nombre.charAt(0) : <User className="w-6 h-6" />}
                </div>

                <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-blue-700 transition-colors pr-16 break-words">
                    {user.nombre} {user.apellido}
                </h3>
            </div>

            {/* Información completa - sin truncar */}
            <div className="space-y-3 mb-4 flex-grow">
                {/* Cargo */}
                <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600 font-medium leading-normal break-words">
                        {user.cargo || "Colaborador"}
                    </p>
                </div>

                {/* Gerencia */}
                <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600 leading-normal break-words">
                        {user.gerencia || "No especificada"}
                    </p>
                </div>

                {/* Jefatura */}
                <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600 leading-normal break-words">
                        {user.jefatura || "No especificada"}
                    </p>
                </div>
            </div>

            {/* Separador + Correo */}
            <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium break-all">
                        {user.email || "correo@cmf.cl"}
                    </span>
                </div>
            </div>
        </motion.div>
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
    onSelect: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    sending: PropTypes.bool
};

export default BirthdayCard;
