import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = ({ socket }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/api');
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
            setLoading(false);
        };

        fetchProducts();

        const handleBidResponse = (data) => {
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.name === data.name ? {
                        ...product, price: parseFloat(data.amount).toFixed(2)
                    } : product
                )
            );
        };

        socket.on("bidProductResponse", handleBidResponse);
        return () => socket.off("bidProductResponse", handleBidResponse);
    }, [socket]);

    const bidProduct = (product) => {
        navigate(`/products/bid/${product.name}/${product.price}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (products.length === 0) {
        return <div className="noprod">No products available.</div>;
    }

    const DisplayDescription = ({ text }) => {
        const paragraphs = text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
        return <div className="itemline">{paragraphs}</div>;
    };

    return (
        <div>
            {/* Table layout */}
            <div className="table-responsive">
                <h2 className="title">Products</h2>
                <table id="mytable">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Item Name</th>
                            <th>Item Description</th>
                            <th>Current Bid</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td><img src={product.image} alt={`${product.name} image`} /></td>
                                <td>{product.name}</td>
                                <td><DisplayDescription text={product.description} /></td>
                                <td>${product.price}</td>
                                <td>
                                    <button onClick={() => bidProduct(product)} className='editButton'>
                                        Bid Item
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Card layout */}
            <div className="card-container">
                <h2 className="title">Products</h2>
                <br></br>
                {products.map((product) => (
                    <div className="card" key={product.id}>
                        <h4 className="itemheadercard">{product.name}</h4>
                        <div className="contentcard">
                            <div className="cardimgbox">
                                <img src={product.image} alt={`${product.name} image`} className="card-img" />
                            </div>
                            <div className="card-info">
                                <div className="infotop">
                                    <DisplayDescription text={product.description} />
                                </div>
                                <div className="info-bot">
                                    <div className="priceBox">
                                        <p className="currentbid">Current Bid:</p>
                                        <p className="card-price">${product.price}</p>
                                    </div>
                                    <button onClick={() => bidProduct(product)} className='editButtonCard'>
                                        Bid Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
