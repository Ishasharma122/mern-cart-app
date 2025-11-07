import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import "./App.css";

export default function App() {
  return (
    <Router>
      <header className="sticky-header">

        <div className="header-left">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
            alt="logo"
            className="logo-img"
          />
          <span className="logo-text">Vibe Commerce</span>
        </div>

        <nav className="nav-links">
          <Link to="/">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </nav>

      </header>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>

    </Router>
  );
}
