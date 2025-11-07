import React, { useState, useEffect } from "react";
import { checkout, getCart } from "../api";
import { useNavigate } from "react-router-dom"; 

export default function Checkout() {
    const navigate = useNavigate(); 
    
    const [form, setForm] = useState({ name: "", email: "" });
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        getCart()
            .then(res => {
                setCartItems(res.data.items || []);
                setError(null);
            })
            .catch(err => {
                console.error("Failed to fetch cart for checkout:", err);
                setError("Failed to load cart items. Cannot proceed.");
            });
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setError(null);

        if (loading || cartItems.length === 0) return;

        setLoading(true);

        try {
            const payload = { ...form, cartItems: cartItems };
            const res = await checkout(payload);
            setReceipt(res.data);
            setForm({ name: "", email: "" });

        } catch (err) {
            console.error("Checkout submission failed:", err);
            const message = err.response?.data?.message || "Failed to place order.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="checkout-page-container">
            <div className="checkout-card">
                <h2 className="checkout-header">Complete Your Order</h2>
                
                {error && <p className="checkout-error-message">{error}</p>}
                <form onSubmit={submit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name (for delivery)"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="checkout-input-field"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email (for receipt)"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="checkout-input-field"
                    />
                    <p className="checkout-item-count">
                        Items to Order: <strong>{cartItems.length}</strong>
                    </p>
                    <button 
                        type="submit" 
                        disabled={loading || cartItems.length === 0} 
                        className="checkout-button"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
            {receipt && (
                <div className="receipt-container">
                    
                    <div className="receipt-checkmark">✓</div> 
                    <h3 className="receipt-header">Order Confirmed!</h3>
                    
                    <p>Thank you for your order, <strong>{receipt.name}</strong>.</p>
                    <p className="receipt-email-text">
                        A receipt will be sent to <strong>{receipt.email}</strong>.
                    </p>

                    <p>Total: <strong className="receipt-total-paid">₹{receipt.total.toFixed(2)}</strong></p>
                    <button 
                        className="receipt-continue-button"
                        onClick={() => navigate('/')} 
                    >
                        Continue Shopping
                    </button>

                </div>
            )}
        </div>
    );
}