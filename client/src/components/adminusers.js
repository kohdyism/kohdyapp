import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = ({ socket }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/api');
            const data = await response.json();
            setUsers(data.users);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    const deleteUser = (userName, userPhone) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const updatedUsers = users.filter(user => !(user.name === userName && user.phone === userPhone));
            setUsers(updatedUsers); // Update state to remove the product
            socket.emit("deleteUser", { name: userName, phone: userPhone });  // Ensure backend matches this deletion logic
        }
    };

    return (
        <div className="table__container">
            <h2 className="title">Registered Users</h2>
            <table id="mytable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>

                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6">Loading...</td>
                        </tr>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <tr key={`${user.name}-${user.phone}`}>
                                <td>{user.name}</td>
                                <td>{user.phone}</td>
                                <td>
                                    <button onClick={() => deleteUser(user.name, user.phone)} className='deleteButton'>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No users available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
