import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import FormularioExclusion from '../components/dashboard/FormularioExclusion';

const ExclusionPage = () => {
    return (
        <MainLayout>
            <div className="font-sans text-slate-800 mt-8 mb-4">
                <div className="max-w-4xl mx-auto">
                    <FormularioExclusion />
                </div>
            </div>
        </MainLayout>
    );
};

export default ExclusionPage;
