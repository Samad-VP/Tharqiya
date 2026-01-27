import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InterviewerRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-tharqiya-cream dark:bg-slate-950 px-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-tharqiya-orange border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-black text-tharqiya-orange text-[10px]">TK</div>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'INTERVIEWER') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default InterviewerRoute;
