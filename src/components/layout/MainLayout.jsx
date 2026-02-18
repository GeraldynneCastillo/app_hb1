
import React from 'react';

const MainLayout = ({ children, headerActions }) => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-pink-100 selection:text-pink-900">
            {/* Ambient Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
                <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] bg-pink-200/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>

            {/* Floating Action Bar (if needed) */}
            {headerActions && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                    {headerActions}
                </div>
            )}
        </div>
    );
};

export default MainLayout;
