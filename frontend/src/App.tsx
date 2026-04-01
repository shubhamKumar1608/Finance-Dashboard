import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import './App.css';

export const AuthContext = React.createContext<{
    token: string | null;
    setToken: (t: string | null) => void;
}>({ token: null, setToken: () => { } });

export default function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('finance_token'));

    useEffect(() => {
        if (token) localStorage.setItem('finance_token', token);
        else localStorage.removeItem('finance_token');
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={!token ? <AuthPage /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
                    <Route path="/records" element={token ? <Records /> : <Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}
