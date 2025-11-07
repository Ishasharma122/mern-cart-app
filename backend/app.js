import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import mongoose from "mongoose";
dotenv.config();
const app = express();
app.use(cors());
 app.use(express.json());

const url = process.env.MONGO_URL;
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB Connection Error:", err));

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use((err, req, res, next) => {
console.error(" Error", err.stack || err.message || err);
res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
