import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../type/User';
import type { AuthContextType } from '../type/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/me`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setUser(result.payload);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Failed to check auth:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: Record<string, string>) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/sso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                await checkAuth();
                return { success: true, message: result.message };
            }

            // Jika validasi gagal atau unauthorized
            return { success: false, message: result.message || 'Login gagal' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Terjadi kesalahan jaringan' };
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
