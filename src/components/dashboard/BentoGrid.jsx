import React from 'react';
import BirthdayCard from '../ui/BirthdayCard';
import { formatCurrentDate } from '../../utils/dateUtils';

const BentoGrid = ({
    todayUsers,
    week1Users,
    week2Users,
    week3Users,
    futureUsers,
    pastUsers = [],
    selectedUsers,
    toggleSelection,
    sending
}) => {

    // Obtener la fecha formateada para mostrar en el título
    const currentDateFormatted = formatCurrentDate();

    return (
        <div className="space-y-12 pb-20">

            {/* SECTION 1: TODAY'S CELEBRATIONS (Highlighted) */}
            <section className="bg-blue-50/50 border-l-4 border-blue-500 rounded-r-2xl p-6 mb-12">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            🎉 Celebraciones de Hoy
                            <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                                {todayUsers.length}
                            </span>
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
                                onSelect={toggleSelection}
                                isSelected={selectedUsers.some(u => u.email === user.email)}
                                sending={sending}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-slate-400 font-medium text-lg">No hay cumpleaños registrados para hoy.</p>
                    </div>
                )}
            </section>

            {/* SHARED GRID LAYOUT FOR UPCOMING SECTIONS */}
            {/* Grid classes: Mobile: 1, Tablet: 2, Desktop: 3, Large: 4 */}

            {/* SECTION 2: CURRENT WEEK */}
            {week1Users.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-slate-700 flex items-center gap-3 mb-6">
                        📅 Semana Actual
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                            {week1Users.length}
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {week1Users.map((user) => (
                            <BirthdayCard
                                key={user.userId || user.email}
                                user={user}
                                status="upcoming_week"
                                onSelect={toggleSelection}
                                isSelected={selectedUsers.some(u => u.email === user.email)}
                                sending={sending}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* SECTION 3: NEXT WEEK */}
            {week2Users.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-slate-700 flex items-center gap-3 mb-6">
                        🚀 Próxima Semana
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                            {week2Users.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {week2Users.map((user) => (
                            <BirthdayCard
                                key={user.userId || user.email}
                                user={user}
                                status="future"
                                onSelect={toggleSelection}
                                isSelected={selectedUsers.some(u => u.email === user.email)}
                                sending={sending}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* SECTION 4: FOLLOWING WEEK */}
            {week3Users.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-slate-700 flex items-center gap-3 mb-6">
                        👀 Siguiente Semana
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                            {week3Users.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {week3Users.map((user) => (
                            <BirthdayCard
                                key={user.userId || user.email}
                                user={user}
                                status="future"
                                onSelect={toggleSelection}
                                isSelected={selectedUsers.some(u => u.email === user.email)}
                                sending={sending}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* SECTION 5: FUTURE */}
            {futureUsers.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-slate-700 flex items-center gap-3 mb-6">
                        📅 Próximos Cumpleaños
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                            {futureUsers.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {futureUsers.map((user) => (
                            <BirthdayCard
                                key={user.userId || user.email}
                                user={user}
                                status="future"
                                onSelect={toggleSelection}
                                isSelected={selectedUsers.some(u => u.email === user.email)}
                                sending={sending}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* SECTION 6: PAST BIRTHDAYS */}
            {pastUsers.length > 0 && (
                <section className="opacity-60 grayscale-[0.5] mt-16 pt-8 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-400 mb-6 flex items-center gap-3">
                        🕓 Cumpleaños Pasados
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">
                            {pastUsers.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pastUsers.map((user) => (
                            <BirthdayCard
                                key={user.userId || user.email}
                                user={user}
                                status="past"
                                onSelect={toggleSelection}
                                isSelected={selectedUsers.some(u => u.email === user.email)}
                                sending={sending}
                            />
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
};

export default BentoGrid;
