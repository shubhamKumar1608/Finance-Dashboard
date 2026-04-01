import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';
import { LogOut, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function Dashboard() {
    const { token, setToken } = useContext(AuthContext);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });

    useEffect(() => {
        fetch('http://localhost:3000/api/v1/dashboard/summary', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setSummary(data))
            .catch(console.error);
    }, [token]);

    return (
        <div className="app-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Analytics Overview</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="/records" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center' }}>Manage Records</a>
                    <button className="btn btn-primary" onClick={() => setToken(null)}><LogOut size={18} /> Logout</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <DollarSign className="text-primary" />
                        <h2 style={{ margin: 0 }}>Net Balance</h2>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: summary.netBalance >= 0 ? '#fff' : 'var(--error)' }}>
                        ${summary.netBalance.toLocaleString()}
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <TrendingUp color="var(--accent)" />
                        <h2 style={{ margin: 0 }}>Total Income</h2>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                        ${summary.totalIncome.toLocaleString()}
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <TrendingDown color="var(--error)" />
                        <h2 style={{ margin: 0 }}>Total Expenses</h2>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                        ${summary.totalExpense.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
