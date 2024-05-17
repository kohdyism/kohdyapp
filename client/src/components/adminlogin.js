import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();  // Use the same login function
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '12345678') {  // Admin-specific password check
            login(true);  // Call login with true to indicate admin status
            navigate('/admin/products');
        } else {
            setError(true);
        }
    };

    return (
        <div className='login'>
            <form className="loginForm" onSubmit={handleSubmit}>
                <h2 className='loginHeader'>Admin Login</h2>
                <div className='input'>
                    <label htmlFor="password">Password
                        <input
                            type="password"
                            name="password"
                            className="adminInput"
                            placeholder='Type your password here'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {error && <p style={{ color: "red" }}>Password is invalid</p>}
                </div>
                <div>
                    <button className="loginCta">Login</button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
