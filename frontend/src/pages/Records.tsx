import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';
import { ArrowLeft, Trash2, Plus, Info } from 'lucide-react';

export default function Records() {
    const { token, user } = useContext(AuthContext);
    const [records, setRecords] = useState<any[]>([]);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [category, setCategory] = useState('');

    const isAdmin = user?.role === 'ADMIN';

    const fetchRecords = () => {
        fetch('/api/v1/records', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setRecords(data.records || []))
            .catch(console.error);
    };

    useEffect(() => {
        fetchRecords();
    }, [token]);

    const addRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;
        await fetch('/api/v1/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ amount: parseFloat(amount), type, category, date: new Date().toISOString() })
        });
        setAmount(''); setCategory('');
        fetchRecords();
    };

    const deleteRecord = async (id: string) => {
        if (!isAdmin) return;
        await fetch(`/api/v1/records/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchRecords();
    };

    return (
        <div className="app-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a href="/dashboard" className="btn btn-outline" style={{ padding: '0.5rem' }}><ArrowLeft size={20} /></a>
                    <h1 style={{ margin: 0 }}>Financial Records</h1>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 350px' : '1fr', gap: '2rem', alignItems: 'start' }}>
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                {isAdmin && <th style={{ padding: '1rem', width: '50px' }}></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(record.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>{record.category}</td>
                                    <td style={{ padding: '1rem', fontWeight: 600, color: record.type === 'INCOME' ? 'var(--accent-light)' : '#fff' }}>
                                        {record.type === 'INCOME' ? '+' : '-'}${record.amount.toLocaleString()}
                                    </td>
                                    {isAdmin && (
                                        <td style={{ padding: '1rem' }}>
                                            <button onClick={() => deleteRecord(record.id)} className="btn btn-outline" style={{ border: 'none', color: 'var(--error)', padding: '0.25rem' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 4 : 3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {isAdmin ? (
                    <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Add New Record</h2>
                        <form onSubmit={addRecord}>
                            <div className="form-group">
                                <label>Amount ($)</label>
                                <input type="number" className="input-base" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" step="0.01" />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select className="input-base" value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.75rem', width: '100%' }}>
                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input type="text" className="input-base" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Salary, Groceries" required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}><Plus size={18} /> Add Record</button>
                        </form>
                    </div>
                ) : (
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Info color="var(--primary)" />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                You are logged in as an <strong>{user?.role}</strong>. You have read-only access to records.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
