import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import SEO from './SEO';

const PrincipalRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream dark:bg-slate-950">
                <Loader2 className="w-12 h-12 text-edu-teal animate-spin" />
            </div>
        );
    }

    if (!user || (user.role !== 'PRINCIPAL' && user.role !== 'SUPER_ADMIN')) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <SEO noindex title="Principal Portal" />
            <Outlet />
        </>
    );
};

export default PrincipalRoute;
