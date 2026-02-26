import React from 'react';

const AppHeader = () => {
    return (
        <header
            className="w-full py-5 sm:py-6 px-4 sm:px-6 lg:px-8"
            style={{
                background: 'linear-gradient(135deg, #23338b 0%, #1e40af 35%, #3730a3 65%, #4c1d95 100%)',
            }}
        >
            <div className="max-w-7xl mx-auto flex items-center gap-4">
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
            </div>
        </header>
    );
};

export default AppHeader;
