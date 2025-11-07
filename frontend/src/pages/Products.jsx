import React, { useEffect, useState } from "react";
import { getProducts, addToCart } from "../api";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  const handleAdd = (id) => {
    addToCart({ productId: id, qty: 1 });
    alert("Added to cart");
  };

 return (
    <div className="products-page">
      <h1 className="title">All Products</h1>
      <p className="subtitle">Discover our curated collection of high-quality products</p>

    <div className="products-grid">
      {products.map((p) => (
       <div key={p._id} className="product-card">
    <div className="product-image">
     <img src={p.image} alt={p.name} />
     </div>
          <div className="product-info"> 
            <h3>{p.name}</h3>
     </div>
             <p className="price">₹{p.price}</p>
           <div className="button-wrapper"> 
       <button className="add-to-cart-btn"onClick={() => handleAdd(p._id)}>Add to Cart</button>
      </div>
 </div>
 ))}
 </div>
 </div>
);
}