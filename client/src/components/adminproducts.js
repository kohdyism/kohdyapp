import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProducts = ({ socket }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();

    }, []);


    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:4000/api');
            const data = await response.json();
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };


    const deleteProduct = (productName, productPrice) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const updatedProducts = products.filter(product => !(product.name === productName && product.price === productPrice));
            setProducts(updatedProducts);
            if (socket) {
                socket.emit("deleteProduct", { name: productName, price: productPrice });
            } else {
                console.error("Socket is not initialized.");
            }
        }
    };


    const addProduct = () => {
        navigate('/admin/products/add');
    };

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
                            <th>Last Bidder</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6">Loading...</td>
                            </tr>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <tr key={`${product.name}-${product.price}`}>
                                    <td><img src={product.image || 'https://placeholder.com/150'} alt={`${product.name} image`} /></td>
                                    <td>{product.name}</td>
                                    <td><DisplayDescription text={product.description} /></td>
                                    <td>${product.price}</td>
                                    <td>{product.last_bidder || 'None'}</td>
                                    <td>
                                        <button onClick={() => deleteProduct(product.name, product.price)} className='deleteButton'>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No products available.</td>
                            </tr>
                        )}
                    </tbody>

                </table>

                <button onClick={addProduct} className='addProductCta'>
                    Add Item
                </button>

            </div>
            {/* Card layout */}
            <div className="card-container">
                <h2 className="title">Products</h2>
                <br></br>
                {products.map((product) => (
                    <div className="card" key={product.id}>
                        <h4 className="itemheadercard">{product.name}</h4>


                        <div className="contentcard">

                            <div className="cardimgbox"><img src={product.image} alt={`${product.name} image`} className="card-img" /></div>
                            <div className="card-info">
                                <div className="infotop">
                                    <DisplayDescription text={product.description} />
                                </div>


                                <div className="info-bot">
                                    <div className="priceBox">
                                        <p className="currentbid">Last Bidder:</p>
                                        <p className="card-price">{product.last_bidder || 'None'}</p>
                                    </div>
                                    <div className="priceBox">
                                        <p className="currentbid">Current Bid:</p>
                                        <p className="card-price">${product.price}</p>
                                    </div>

                                    <button onClick={() => deleteProduct(product.name, product.price)} className='deleteButtonCard'>
                                        Delete
                                    </button>
                                </div>


                            </div>

                        </div>

                    </div>

                ))}
                <button onClick={addProduct} className='addProductCta'>
                    Add Item
                </button>
            </div>


        </div>

    );
};

export default AdminProducts;
