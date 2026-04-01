import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';
import { User, Shield, UserCheck, UserX, ArrowLeft } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
}

export default function Users() {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/v1/users', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const updateUser = async (id: string, updates: Partial<UserData>) => {
        await fetch(`/api/v1/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });
        fetchUsers();
    };

    return (
        <div className="app-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a href="/" className="btn btn-outline" style={{ padding: '0.5rem' }}><ArrowLeft size={20} /></a>
                    <h1>User Management</h1>
                </div>
            </header>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '1.25rem' }}>Name</th>
                            <th style={{ padding: '1.25rem' }}>Email</th>
                            <th style={{ padding: '1.25rem' }}>Role</th>
                            <th style={{ padding: '1.25rem' }}>Status</th>
                            <th style={{ padding: '1.25rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderTop: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.25rem', fontWeight: 500 }}>{user.name}</td>
                                <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <select
                                        className="input-base"
                                        style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                                        value={user.role}
                                        onChange={(e) => updateUser(user.id, { role: e.target.value })}
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="ANALYST">ANALYST</option>
                                        <option value="VIEWER">VIEWER</option>
                                    </select>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        background: user.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: user.status === 'ACTIVE' ? 'var(--accent)' : 'var(--error)',
                                        border: `1px solid ${user.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                                    {user.status === 'ACTIVE' ? (
                                        <button
                                            className="btn btn-outline"
                                            style={{ color: 'var(--error)', padding: '0.5rem' }}
                                            onClick={() => updateUser(user.id, { status: 'INACTIVE' })}
                                            title="Deactivate"
                                        >
                                            <UserX size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-outline"
                                            style={{ color: 'var(--accent)', padding: '0.5rem' }}
                                            onClick={() => updateUser(user.id, { status: 'ACTIVE' })}
                                            title="Activate"
                                        >
                                            <UserCheck size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading users...
                    </div>
                )}
                {!loading && users.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
