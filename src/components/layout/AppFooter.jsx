import React from 'react';

/**
 * Footer de la aplicación con gradiente azul suave
 * y datos institucionales
 */
const AppFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="w-full py-7 sm:py-8 px-4 sm:px-6 lg:px-8 mt-auto"
            style={{
                background: 'linear-gradient(135deg, #23338b 0%, #1e40af 35%, #3730a3 65%, #4c1d95 100%)',
            }}
        >
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 text-center">
                <p className="text-white font-semibold text-sm sm:text-base">
                    © {currentYear} Todos los derechos reservados
                </p>
                <p className="text-white/70 text-xs sm:text-sm">
                    Departamento de Tecnología y Digitalización
                </p>
                <p className="text-white/50 text-xs sm:text-sm font-medium mt-1">
                    v1.0.0
                </p>
            </div>
        </footer>
    );
};

export default AppFooter;
