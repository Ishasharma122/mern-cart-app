import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const getProducts = () => API.get("/products");
export const getCart = () => API.get("/cart");
export const addToCart = async (data) => {
  return await API.post("/cart", data);
};
export const deleteFromCart = (id) => API.delete(`/cart/${id}`);
export const updateCartQty = (id, qty) => API.put(`/cart/${id}`, { qty });
export const checkout = (payload) => API.post("/cart/checkout", payload);
