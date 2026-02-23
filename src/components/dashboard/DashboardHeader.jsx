import React from 'react';

const DashboardHeader = ({ countToday }) => {
    return (
        <div className="mb-8">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                    {/* El Componente principal ya usa título de app, así que podemos simplificar aquí 
                        o dejar un título de sección si es necesario. Según el plan, quitamos el saludo dinámico. 
                    */}
                </h1>
            </div>
        </div>
    );
};

export default DashboardHeader;
