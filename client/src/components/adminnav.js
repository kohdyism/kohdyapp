import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminNav = ({ socket }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const navRef = useRef(null); // Ref to help with detecting outside clicks

    useEffect(() => {
        const handleProductAdd = data => {
            const newNotification = `@${data.name} has been listed for $${Number(data.price).toLocaleString()}`;
            setNotifications(prev => [...prev, newNotification]);
            setTimeout(() => setNotifications(prev => prev.slice(1)), 5000);
        };

        socket.on("addProductResponse", handleProductAdd);
        return () => socket.off("addProductResponse", handleProductAdd);
    }, [socket]);

    useEffect(() => {
        const handleBidResponse = data => {
            const newNotification = `@${data.name} has received a new bid of $${Number(data.amount).toLocaleString()}`;
            setNotifications(prev => [...prev, newNotification]);
            setTimeout(() => setNotifications(prev => prev.slice(1)), 5000);
        };

        socket.on("bidProductResponse", handleBidResponse);
        return () => socket.off("bidProductResponse", handleBidResponse);
    }, [socket]);

    useEffect(() => {
        // Function to handle clicking outside the menu
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            closeMenu();
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div ref={navRef}>
            {notifications.map((note, index) => (
                <div key={index} className='notification'>
                    <p className='alert'>{note}</p>
                </div>
            ))}

            <nav className='navbar'>
                <div className='nav'>
                    <div className='logonname'>
                        <img src='https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Defence_Science_%26_Technology_Agency_logo.svg/640px-Defence_Science_%26_Technology_Agency_logo.svg.png' className='logo' alt='logo' />
                        <h4>Admin Page</h4>
                    </div>
                    <button className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation">☰</button>
                    <ul className={`topnav ${isMenuOpen ? 'open' : ''}`}>
                        <li><Link to="/admin/products" onClick={() => closeMenu()}>Manage Products</Link></li>
                        <li><Link to="/admin/users" onClick={() => closeMenu()}>Manage Users</Link></li>
                        <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default AdminNav;
