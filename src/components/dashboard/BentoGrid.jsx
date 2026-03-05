import React, { useState, useEffect } from 'react';
import BirthdayCard from '../ui/BirthdayCard';
import HorizontalCarousel from '../ui/HorizontalCarousel';
import { formatCurrentDate } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BentoGrid = ({
    todayUsers,
    week1Users,
    allFilteredUsers = [],
    hasActiveFilters = false,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 12;

    useEffect(() => {
        setCurrentPage(1);
    }, [allFilteredUsers]);

    const currentDateFormatted = formatCurrentDate();

    return (
        <div className="space-y-8 pb-16">
            {hasActiveFilters ? (
                // --- VISTA CON FILTROS ACTIVOS (Lista Plana Paginada) ---
                <section>
                    {allFilteredUsers.length > 0 ? (
                        <>
                            {/* Grid responsivo: 1 col móvil, 2 tablet, 3 desktop, 4 xl */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                {allFilteredUsers
                                    .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
                                    .map((user) => (
                                        <BirthdayCard
                                            key={user.userId || user.email}
                                            user={user}
                                            status="search_result"
                                        />
                                    ))}
                            </div>

                            {/* Paginación windowed estilo Google */}
                            {allFilteredUsers.length > cardsPerPage && (() => {
                                const totalPages = Math.ceil(allFilteredUsers.length / cardsPerPage);
                                const delta = 1;

                                const pages = [];
                                const rangeStart = Math.max(2, currentPage - delta);
                                const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

                                pages.push(1);
                                if (rangeStart > 2) pages.push('...');
                                for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
                                if (rangeEnd < totalPages - 1) pages.push('...');
                                if (totalPages > 1) pages.push(totalPages);

                                const btnBase = "h-9 min-w-[36px] px-2 rounded-xl font-medium text-sm transition-all flex items-center justify-center";
                                const btnActive = "bg-indigo-600 text-white shadow-md";
                                const btnInactive = "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-300";
                                const btnDisabled = "bg-white border border-slate-100 text-slate-300 cursor-not-allowed";

                                return (
                                    <div className="flex justify-center items-center mt-10 gap-1.5 flex-wrap">

                                        {/* Anterior */}
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive} gap-1`}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span className="hidden sm:inline">Anterior</span>
                                        </button>

                                        {/* Números con ellipsis */}
                                        {pages.map((page, i) =>
                                            page === '...'
                                                ? <span key={`e${i}`} className="px-1 text-slate-400 text-sm select-none">…</span>
                                                : <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`${btnBase} ${currentPage === page ? btnActive : btnInactive}`}
                                                >
                                                    {page}
                                                </button>
                                        )}

                                        {/* Siguiente */}
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive} gap-1`}
                                        >
                                            <span className="hidden sm:inline">Siguiente</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })()}
                        </>
                    ) : (
                        // --- ESTADO VACÍO ---
                        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white/60 rounded-2xl border border-slate-200 border-dashed">
                            <span className="text-6xl select-none">🔍</span>
                            <div className="text-center">
                                <p className="text-slate-700 font-semibold text-xl">Sin resultados</p>
                                <p className="text-slate-400 text-sm mt-1">
                                    Intenta con otro nombre, mes o gerencia.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            ) : (
                // --- VISTA SIN FILTROS: solo HOY y ESTA SEMANA ---
                <>
                    <section className="bg-gradient-to-b from-blue-50/60 to-transparent border-l-4 border-blue-500 pt-4 pb-10 px-6">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    🎉 Celebraciones de Hoy
                                </h2>
                                <span className="text-slate-400 font-medium text-xl hidden md:inline-block">|</span>
                                <span className="text-slate-500 font-medium text-lg capitalize">{currentDateFormatted}</span>
                            </div>
                        </div>

                        {todayUsers.length > 0 ? (
                            <HorizontalCarousel>
                                {todayUsers.map((user) => (
                                    <BirthdayCard
                                        key={user.userId || user.email}
                                        user={user}
                                        status="today"
                                    />
                                ))}
                            </HorizontalCarousel>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-600 font-semibold text-sm">Sin celebraciones hoy.</p>
                                    <p className="text-slate-400 text-xs mt-0.5">No se registran colaboradores de cumpleaños el día de hoy.</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {week1Users.length > 0 && (
                        <hr className="border-none h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    )}
                    {week1Users.length > 0 && (
                        <section className="bg-gradient-to-b from-blue-50/50 to-transparent border-l-4 border-blue-400 pt-4 pb-10 px-6">
                            <div className="flex items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    📅 Esta Semana
                                </h2>
                            </div>
                            <HorizontalCarousel>
                                {week1Users.map((user) => (
                                    <BirthdayCard
                                        key={user.userId || user.email}
                                        user={user}
                                        status="week1"
                                    />
                                ))}
                            </HorizontalCarousel>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

export default BentoGrid;
