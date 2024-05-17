import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const AdminAddProduct = ({ socket }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    function resizeImage(file, maxWidth, maxHeight, callback) {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onerror = () => setError("Error reading file, please try again.");
        reader.onload = readerEvent => {
            const image = new Image();
            image.onerror = () => setError("Invalid image content, please upload an image file.");
            image.onload = () => {
                const canvas = document.createElement('canvas');
                let width = image.width;
                let height = image.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                canvas.toBlob(callback, 'image/jpeg', 0.7);
            };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    }

    const handleImageChange = e => {
        setError(''); // Clear previous errors
        const file = e.target.files[0];
        if (file) {
            resizeImage(file, 800, 600, blob => {
                const reader = new FileReader();
                reader.onload = e => {
                    setImage(e.target.result);
                };
                reader.readAsDataURL(blob);
            });
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!image) {
            setError('Please upload an image for the product.');
            return;
        }

        const numericPrice = parseFloat(price);
        if (numericPrice < 1500) {
            setError('Item starting bid should be at least $1500.');
            return;
        }
        if (numericPrice % 100 !== 0) {
            setError('Item starting bid should be in multiples of $100.');
            return;
        }

        socket.emit('addProduct', {
            name,
            price: numericPrice.toFixed(2),
            description,
            image,
            owner: localStorage.getItem("userName")
        });

        navigate("/admin/products");
    };

    return (
        <div className='bidproduct__container'>
            <form className="bidProduct__form" onSubmit={handleSubmit}>
                <h3 className='bidProduct__name'>Add New Item</h3>
                <div className='inputArea'>
                    <div className='formAddProduct'>
                        <label htmlFor='name'>Item Name</label>
                        <input className='productInput' type="text" id='name' value={name} placeholder='Type item name here' onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className='formAddProduct'>
                        <label htmlFor='description'>Description</label>
                        <textarea className='productInputdesc' id='description' value={description} placeholder='Type the item description here' onChange={e => setDescription(e.target.value)} required />
                    </div>
                    <div className='formAddProduct'>
                        <label htmlFor='price'>Starting Bid</label>
                        <input className='productInput' type="number" id='price' value={price} placeholder='Type your starting bid here' onChange={e => setPrice(e.target.value)} required />
                    </div>
                    {error && <p className='errorText' style={{ color: "red" }}>{error}</p>}
                    <div className='formAddProduct'>
                        <label htmlFor='image'>Item Image</label>
                        <input className='productInput' type="file" id="image" accept="image/*" onChange={handleImageChange} required />
                    </div>
                </div>
                <button className='loginCta'>Add Item</button>
            </form>
        </div>
    );
};

export default AdminAddProduct;
