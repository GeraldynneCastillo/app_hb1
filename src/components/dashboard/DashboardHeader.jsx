
import React, { useState, useEffect } from 'react';
import { getGreeting } from '../../utils/dateUtils';

const DashboardHeader = ({ countToday }) => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src="/static/logo.png"
                    alt="CMF Logo"
                    className="h-16 w-auto object-contain drop-shadow-sm"
                />
            </div>

            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                    {greeting}
                </h1>
            </div>
        </div>
    );
};

export default DashboardHeader;
