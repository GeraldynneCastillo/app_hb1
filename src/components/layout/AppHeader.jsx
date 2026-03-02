import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ban } from 'lucide-react';

const AppHeader = () => {
    const location = useLocation();

    return (
        <header
            className="w-full py-5 sm:py-6 px-4 sm:px-6 lg:px-8"
            style={{
                background: 'linear-gradient(135deg, #23338b 0%, #1e40af 35%, #3730a3 65%, #4c1d95 100%)',
            }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Logo + Nombre */}
                <div className="flex items-center gap-4">
                    <img
                        src="/static/logo.png"
                        alt="CMF Logo"
                        className="h-12 sm:h-14 w-auto object-contain rounded-lg bg-white/90 p-1.5 shadow-md"
                    />
                    <div className="flex flex-col">
                        <span className="text-white font-extrabold text-xl sm:text-2xl tracking-wide drop-shadow-md">
                            Envases CMF S.A.
                        </span>
                        <div className="text-white font-semibold text-sm sm:text-base">
                            CUMPLEAÑOS
                        </div>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex items-center gap-2">
                    <Link
                        to="/excluidos"
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === '/excluidos'
                                ? 'bg-white/20 text-white'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        title="Gestionar exclusiones de correo"
                    >
                        <Ban className="w-4 h-4" />
                        <span className="hidden sm:inline">Exclusiones</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default AppHeader;

