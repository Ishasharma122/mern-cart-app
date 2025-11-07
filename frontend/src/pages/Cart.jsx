import React, { useEffect, useState } from "react";
import { getCart, deleteFromCart, updateCartQty } from "../api"; 
import { useNavigate } from "react-router-dom"; 

export default function Cart() {
    const navigate = useNavigate(); 
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            setCart(res.data.items);
            setTotal(res.data.total);
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeItem = async (id) => {
        try {
            await deleteFromCart(id); 
            fetchCart();
        } catch (err) {
            console.error("Error removing item:", err);
        }
    };

    const updateQty = async (id, currentQty, type) => {
        let newQty = type === "inc" ? currentQty + 1 : currentQty - 1;
        if (newQty < 1) {
            return; 
          }
        try {
            await updateCartQty(id, newQty); 
            fetchCart();
        } catch (err) {
            console.error("Error updating quantity:", err);
            alert("Failed to update quantity.");
        }
    };
    if (cart.length === 0) {
        return (
            <div className="cart-page-container">
                <h2 className="empty-cart-message">Your cart is empty!</h2>
                <button 
                    className="checkout-button" 
                    style={{maxWidth: '300px', margin: '30px auto'}}
                    onClick={() => navigate('/')}
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <h2>Your Cart</h2>

            <div className="cart-content-wrapper">
                <div className="cart-items-list">
                    {cart.map((item) => (
                        <div className="cart-item-card" key={item._id}>
                            <div className="item-details">
                                <img 
                                    className="item-image" 
                                    src={item.productId?.image} 
                                    alt={item.productId?.title} 
                                />
                                <div className="item-info">
                                    <h4 className="item-name">{item.productId?.title}</h4>
                                    <p className="item-price">₹{item.productId?.price}</p>
                                </div>
                            </div>
                            
                            <div className="item-actions">
                                <div className="quantity-controls">
                                    <button 
                                        onClick={() => updateQty(item._id, item.qty, "dec")}
                                        disabled={item.qty <= 1} 
                                    >
                                        -
                                    </button>
                                    <input type="number" readOnly value={item.qty} />
                                    <button 
                                        onClick={() => updateQty(item._id, item.qty, "inc")}
                                    >
                                        +
                                    </button>
                                </div>
                                <button className="remove-button" onClick={() => removeItem(item._id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-summary-card">
                    <h3 className="summary-header">Order Summary</h3>
                    
                    <div className="summary-row">
                        <p>Subtotal:</p>
                        <p>₹{total.toFixed(2)}</p>
                    </div>
                    
                    <div className="summary-row summary-total">
                        <h4>Total:</h4>
                        <h4>₹{total.toFixed(2)}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}