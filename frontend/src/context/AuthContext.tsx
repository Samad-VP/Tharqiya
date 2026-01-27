import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axiosInstance';

interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    role: string;
    isFirstLogin?: boolean;
    token: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
    register: (userData: any) => Promise<User>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('edu_village_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<User> => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const userData = response.data.data;
            setUser(userData);
            localStorage.setItem('edu_village_user', JSON.stringify(userData));
            return userData;
        } catch (error: any) {
            throw error.response?.data || { message: 'Login failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('edu_village_user');
    };

    const register = async (userData: any): Promise<User> => {
        try {
            const response = await api.post('/auth/register', userData);
            const newUser = response.data.data;
            setUser(newUser);
            localStorage.setItem('edu_village_user', JSON.stringify(newUser));
            return newUser;
        } catch (error: any) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
