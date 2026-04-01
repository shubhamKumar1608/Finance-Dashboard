import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';
import { LogOut, TrendingUp, TrendingDown, DollarSign, PieChart, Users, History, BarChart3 } from 'lucide-react';

export default function Dashboard() {
    const { token, user, setAuth } = useContext(AuthContext);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/v1/dashboard/full-summary', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, [token]);

    if (!data) return <div className="app-container">Loading analytics...</div>;

    return (
        <div className="app-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>Financial Analytics</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {user?.role === 'ADMIN' && (
                        <a href="/users" className="btn btn-outline"><Users size={18} /> Users</a>
                    )}
                    <a href="/records" className="btn btn-outline">Manage Records</a>
                    <button className="btn btn-primary" onClick={() => setAuth(null, null)}><LogOut size={18} /> Logout</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <DollarSign size={20} className="text-primary" />
                        <span>Net Balance</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: data.netBalance >= 0 ? '#fff' : 'var(--error)' }}>
                        ${data.netBalance.toLocaleString()}
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <TrendingUp size={20} color="var(--accent)" />
                        <span>Total Income</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>
                        ${data.totalIncome.toLocaleString()}
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <TrendingDown size={20} color="var(--error)" />
                        <span>Total Expenses</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>
                        ${data.totalExpense.toLocaleString()}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <BarChart3 size={20} color="var(--primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Spending Trends</h2>
                    </div>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1rem' }}>
                        {data.trends.map((t: any) => {
                            const max = Math.max(...data.trends.map((x: any) => Math.max(x.income, x.expense))) || 1;
                            return (
                                <div key={t.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '100%', display: 'flex', gap: '2px', height: '150px', alignItems: 'flex-end' }}>
                                        <div style={{ background: 'var(--accent)', flex: 1, height: `${(t.income / max) * 100}%`, borderRadius: '2px' }} title={`Income: ${t.income}`} />
                                        <div style={{ background: 'var(--error)', flex: 1, height: `${(t.expense / max) * 100}%`, borderRadius: '2px' }} title={`Expense: ${t.expense}`} />
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', transform: 'rotate(-45deg)' }}>{t.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <PieChart size={20} color="var(--accent)" />
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Top Categories</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.categories.sort((a: any, b: any) => b.amount - a.amount).slice(0, 5).map((cat: any) => (
                            <div key={`${cat.type}-${cat.category}`}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                                    <span>{cat.category} ({cat.type})</span>
                                    <span>${cat.amount.toLocaleString()}</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(cat.amount / (cat.type === 'INCOME' ? data.totalIncome : data.totalExpense)) * 100}%`,
                                        height: '100%',
                                        background: cat.type === 'INCOME' ? 'var(--accent)' : 'var(--primary)'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <History size={20} color="var(--text-muted)" />
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Activity</h2>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {data.recent.map((r: any) => (
                                <tr key={r.id} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 0' }}>
                                        <div style={{ fontWeight: 500 }}>{r.category}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(r.date).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 600, color: r.type === 'INCOME' ? 'var(--accent)' : '#fff' }}>
                                        {r.type === 'INCOME' ? '+' : '-'}${r.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
