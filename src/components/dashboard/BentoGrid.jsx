import React, { useState, useEffect } from 'react';
import BirthdayCard from '../ui/BirthdayCard';
import { formatCurrentDate } from '../../utils/dateUtils';

const BentoGrid = ({
    todayUsers,
    week1Users,
    week2Users,
    week3Users,
    futureUsers,
    pastUsers = [],
    allFilteredUsers = [],
    hasActiveFilters = false,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 20;

    // Reiniciar página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [allFilteredUsers]);

    // Obtener la fecha formateada para mostrar en el título
    const currentDateFormatted = formatCurrentDate();

    return (
        <div className="space-y-12 pb-20">

            {hasActiveFilters ? (
                // --- VISTA CON FILTROS ACTIVOS (Lista Plana Paginada) ---
                <section>
                    <h2 className="text-xl font-bold text-slate-700 flex items-center gap-3 mb-6">
                        🔍 Resultados de Búsqueda
                    </h2>

                    {allFilteredUsers.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {allFilteredUsers.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage).map((user) => (
                                    <BirthdayCard
                                        key={user.userId || user.email}
                                        user={user}
                                        status="search_result"
                                    />
                                ))}
                            </div>

                            {/* Paginación */}
                            {allFilteredUsers.length > cardsPerPage && (
                                <div className="flex justify-center items-center mt-12 gap-2">
                                    {Array.from({ length: Math.ceil(allFilteredUsers.length / cardsPerPage) }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-full font-medium transition-colors ${currentPage === page
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                            <p className="text-slate-500 font-medium text-lg">No se encontraron resultados para tu búsqueda.</p>
                        </div>
                    )}
                </section>
            ) : (
                // --- VISTA SIN FILTROS (Solo sección de Hoy y Pasados recientes) ---
                <>
                    <section className="bg-blue-50/50 border-l-4 border-blue-500 rounded-r-2xl pt-4 pb-6 px-6 mb-12">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    🎉 Celebraciones de Hoy
                                </h2>
                                <span className="text-slate-400 font-medium text-xl hidden md:inline-block">|</span>
                                <span className="text-slate-500 font-medium text-lg capitalize">{currentDateFormatted}</span>
                            </div>
                        </div>

                        {todayUsers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {todayUsers.map((user) => (
                                    <BirthdayCard
                                        key={user.userId || user.email}
                                        user={user}
                                        status="today"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-white/50 rounded-xl">
                                <p className="text-slate-500 font-medium text-lg">No hay cumpleaños registrados para hoy.</p>
                            </div>
                        )}
                    </section>

                    {week1Users.length > 0 && (
                        <section className="mt-10">
                            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-3 mb-6">
                                📅 Esta Semana
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {week1Users.map((user) => (
                                    <BirthdayCard
                                        key={user.userId || user.email}
                                        user={user}
                                        status="week1"
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {pastUsers.length > 0 && (
                        <section className="opacity-60 grayscale-[0.5] mt-16 pt-8 border-t border-slate-200">
                            <h2 className="text-lg font-bold text-slate-400 mb-6 flex items-center gap-3">
                                🕓 Cumpleaños Pasados
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {pastUsers.map((user) => (
                                    <BirthdayCard
                                        key={user.userId || user.email}
                                        user={user}
                                        status="past"
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}

        </div>
    );
};

export default BentoGrid;
