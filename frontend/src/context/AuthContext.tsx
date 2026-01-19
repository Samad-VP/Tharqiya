import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
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
        const storedUser = localStorage.getItem('tharqiya_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<User> => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            setUser(response.data);
            localStorage.setItem('tharqiya_user', JSON.stringify(response.data));
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Login failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tharqiya_user');
    };

    const register = async (userData: any): Promise<User> => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            setUser(response.data);
            localStorage.setItem('tharqiya_user', JSON.stringify(response.data));
            return response.data;
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
