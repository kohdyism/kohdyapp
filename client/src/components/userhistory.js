import React, { useEffect, useState } from 'react';

const UserHistory = ({ socket }) => {
    const name = localStorage.getItem("userName");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserHistory();
    }, [name]);

    const fetchUserHistory = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/user/${name}`);
            const data = await response.json();
            setUser(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch user history:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user found.</div>;
    }

    return (
        <div className='space'>
            <div className="table-responsive">
                <h2 className="title">Your Bidding History</h2>
                <table id="mytable">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Bidded Price</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.bid_history && user.bid_history.length > 0 ? (
                            user.bid_history.map((bid, index) => (
                                <tr key={index}>
                                    <td>{bid.product}</td>
                                    <td>${bid.amount}</td>
                                    <td>{new Date(bid.timestamp).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No bid history</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="card-container">
                <h2 className="title">Your Bidding History</h2>
                <br></br>
                {user.bid_history && user.bid_history.length > 0 ? (
                    user.bid_history.map((bid, index) => (
                        <div className="card" key={index}>
                            <h4 className="itemheadercard">{bid.product}</h4>
                            <div className="contentcard">
                                <div className="card-info">
                                    <div className="info-bot">
                                        <p className="currentbid">Bidded Price:</p>
                                        <p className="currentbid">${bid.amount}</p>
                                        <br></br>

                                        <p className="currentbid">Timestamp:</p>
                                        <p className="currentbid">{new Date(bid.timestamp).toLocaleString()}</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No bid history</p>
                )}
            </div>
        </div >
    );
};

export default UserHistory;
