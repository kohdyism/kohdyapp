import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth to access login and isAuthenticated

const Login = ({ socket }) => {
    const [phone, setPhone] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure the login function from the auth context

    useEffect(() => {
        // Listen for login response from server
        socket.on("userCheckResponse", (response) => {
            if (response.exists) {
                login(); // Update auth state to authenticated
                localStorage.setItem('userName', response.user.name); // Optionally store user info
                navigate('/products'); // Navigate to the products page after successful login
            } else {
                setLoginError('Phone number does not exist. Please register.');
            }
        });

        // Cleanup this effect to avoid memory leaks and unnecessary event listeners
        return () => {
            socket.off("userCheckResponse");
        };
    }, [socket, navigate, login]); // Include login in the dependencies array

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phone.trim().length === 8) {
            socket.emit("checkUser", { phone });
        } else {
            setLoginError('Please input a valid phone number with exactly 8 digits.');
        }
    };

    return (
        <div className='login'>
            <form className="loginForm" onSubmit={handleSubmit}>
                <h2 className='loginHeader'>Login</h2>
                <div className='input'>
                    <label htmlFor="phone">Phone Number
                        <input
                            type="tel"
                            name="phone"
                            className="adminInput"
                            placeholder='Type your registered phone number here'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Only allow digits
                            required
                        />
                        {loginError && <p style={{ color: "#FF747C" }}>{loginError}</p>}
                    </label>
                </div>

                <div>
                    <button className="loginCta">Login</button>
                    <p className='regReminder'>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
