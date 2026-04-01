import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Users from './pages/Users';
import './App.css';

export const AuthContext = React.createContext<{
    token: string | null;
    user: { email: string, role: string, id: string } | null;
    setAuth: (t: string | null, u: any | null) => void;
}>({ token: null, user: null, setAuth: () => { } });

export default function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('finance_token'));
    const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('finance_user') || 'null'));

    const setAuth = (t: string | null, u: any | null) => {
        setToken(t);
        setUser(u);
        if (t) localStorage.setItem('finance_token', t);
        else localStorage.removeItem('finance_token');
        if (u) localStorage.setItem('finance_user', JSON.stringify(u));
        else localStorage.removeItem('finance_user');
    };

    return (
        <AuthContext.Provider value={{ token, user, setAuth }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={!token ? <AuthPage /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
                    <Route path="/records" element={token && user?.role !== 'VIEWER' ? <Records /> : <Navigate to="/" />} />
                    <Route path="/users" element={token && user?.role === 'ADMIN' ? <Users /> : <Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}
