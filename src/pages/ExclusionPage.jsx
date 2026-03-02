import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import FormularioExclusion from '../components/dashboard/FormularioExclusion';

const ExclusionPage = () => {
    return (
        <MainLayout>
            <div className="font-sans text-slate-800 mt-8 max-w-3xl mx-auto">
                {/* Botón de regreso */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Volver al directorio
                </Link>

                {/* Título de la página */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Gestión de Exclusiones</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Agrega correos a la lista negra para que el sistema no les envíe felicitaciones automáticas de cumpleaños.
                    </p>
                </div>

                {/* Formulario */}
                <FormularioExclusion />
            </div>
        </MainLayout>
    );
};

export default ExclusionPage;
