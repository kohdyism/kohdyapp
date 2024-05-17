import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BidProduct = ({ socket }) => {
    const { name } = useParams();
    const [product, setProduct] = useState({
        price: '',
        image: '',
        description: ''
    });
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api`);
                const data = await response.json();
                const foundProduct = data.products.find(p => p.name === name);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    throw new Error("No product found");
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setError('Failed to load product details.');
            }
        };

        fetchProductData();
    }, [name]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const roundedAmount = parseFloat(amount).toFixed(2);

        if (!amount) {
            setError('Please enter a valid amount.');
            return;
        }

        if (parseFloat(roundedAmount) <= parseFloat(product.price)) {
            setError(`Your bid of $${roundedAmount} should be greater than the current bid of $${product.price}.`);
            return;
        }

        if ((parseFloat(roundedAmount) - parseFloat(product.price)) % 100 !== 0) {
            setError('The bid amount should be in increments of $100.');
            return;
        }

        if (socket) {
            socket.emit("bidProduct", {
                amount: roundedAmount,
                last_bidder: localStorage.getItem("userName"),
                name
            }, (response) => {
                if (response.success) {
                    navigate("/products");
                } else {
                    setError('Failed to place bid.');
                }
            });
        } else {
            setError('Socket connection is not established.');
        }
    };

    const DisplayDescription = ({ text }) => {
        const paragraphs = text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
        return <div>{paragraphs}</div>;
    };

    return (
        <div className='bidproduct__container'>
            <form className="bidProduct__form" onSubmit={handleSubmit}>
                <div className='bid_title'>
                    <button className='bid_back' onClick={() => navigate("/products")}>
                        <img src="https://static.thenounproject.com/png/26915-200.png" class="icon"></img>
                        Back</button>
                    <h3 className='bidProduct__name'>{name}</h3>

                </div>

                <div className='productinfo'>
                    <div className='productImgbox'>
                        <img className='productImage' src={product.image} alt={`${name} product`} />
                    </div>
                    <div>
                        <div className='info'>
                            <h4>Item Description</h4>
                            <DisplayDescription text={product.description} />
                        </div>
                        <div className='info'>
                            <h4>Current Bid</h4>
                            <p>${product.price}</p>
                        </div>
                    </div>
                </div>
                <div className='inputArea'>
                    <label htmlFor='amount'>Bidding Amount</label>
                    <input
                        className='biddingInput'
                        type="number"
                        id="amount"
                        name='amount'
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                    />
                    {error && <p className='errorText' style={{ color: "red" }}>{error}</p>}
                    <p>Your bidding amount should be greater than current bid and be in increments of $100</p>
                </div>
                <button className='loginCta'>Place Bid for Item</button>
            </form >
        </div >
    );
};

export default BidProduct;
