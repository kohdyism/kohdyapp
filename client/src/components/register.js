import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"

const Register = ({ socket }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmphone, setConfirmPhone] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        setError('');
        e.preventDefault();
        if (phone !== confirmphone) {
            setError('Your phone number confirmation does not match.');
            return;
        }
        if (phone.length < 8 || phone.length > 8) {
            setError('Please enter a valid Singapore registered phone number.');
            return;
        }

        if (confirmphone.length < 8 || confirmphone.length > 8) {
            setError('Please enter a valid Singapore registered phone number.');
            return;
        }

        window.alert("You have successfully registered!");
        localStorage.setItem('userName', name);
        socket.emit('addUser', { name, phone });
        navigate('/');

    };

    return (
        <div className='login'>
            <form className="loginForm" onSubmit={handleSubmit}>
                <h2 className='loginHeader'>Register</h2>
                <div className='input'>

                    <label htmlFor="name">Full Name *
                        <input
                            type="text"
                            name="name"
                            className="loginInput"
                            placeholder='Type your full name here'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={3}
                        />
                    </label>
                    <label htmlFor="phone">Phone Number *
                        <input
                            type="tel"
                            name="phone"
                            className="loginInput"
                            placeholder='Type your phone number here'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            minLength={8}
                            maxLength={8}
                        />
                    </label>
                    <label htmlFor="confirmphone">Confirm Phone Number *
                        <input
                            type="tel"
                            name="confirmphone"
                            className="loginInput"
                            placeholder='Retype your phone number here'
                            value={confirmphone}
                            onChange={(e) => setConfirmPhone(e.target.value)}
                            required
                            minLength={8}
                            maxLength={8}
                        />
                    </label>
                    {error && <p className='errorText' style={{ color: "red" }}>{error}</p>}

                </div>
                <div className='loginCtaReminder'>
                    <button className="loginCta">Register</button>
                    <p className='regReminder'>Already have an account? <a href="/">Login</a></p>
                </div>

            </form >
        </div >
    );
};

export default Register;