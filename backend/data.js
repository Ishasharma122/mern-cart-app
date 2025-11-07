import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Product from "./models/productModel.js";

dotenv.config();
const url = process.env.MONGO_URL;
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB from data.js");
    Products(); 
  })
  .catch((err) => console.log("DB Connection Error:", err));

const Products = async () => {
  try {
    console.log("Fetching products from Fake Store API...");

    const { data } = await axios.get(
      "https://fakestoreapi.com/products?limit=15"
    );

    const formatted = data.map((item) => ({
      name: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
    }));
    await Product.deleteMany();

    
    await Product.insertMany(formatted);

    console.log("Fake Store API products inserted!");
  } catch (err) {
    console.error("Error inserting products:", err.message);
  }
};
