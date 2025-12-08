
import React, { useState } from 'react';
import { AuthHttpRepository } from '../../../infrastructure/adapters/http/AuthHttpRepository';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState<string | null>(null);
    const authRepository = new AuthHttpRepository();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await authRepository.login(username, password);

        if (result.success && result.token) {
            localStorage.setItem('token', result.token);
            onLoginSuccess(result.token);
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
            <h1>Login</h1>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer' }}>Login</button>
            </form>
        </div>
    );
};
