import Product from "../models/productModel.js";
import axios from "axios";

export const getProducts = async (req, res, next) => {
try {
let products = await Product.find();
if (!products || products.length === 0) {
const { data } = await axios.get("https://fakestoreapi.com/products?limit=10");
const formatted = data.map((p) => ({
name: p.title,
price: Math.round(p.price * 80), 
originalSource: "fakestoreapi",
metadata: { category: p.category },
}));

products = await Product.insertMany(formatted);
console.log("Products from fake API added");
}
res.json(products);
} catch (err) {
next(err);
}
};
