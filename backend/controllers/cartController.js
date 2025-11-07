import CartItem from "../models/cartModel.js";
import Product from "../models/productModel.js";
export const getCart = async (req, res, next) => {
  try {
    const { userId } = req.query; 
    const filter = userId ? { userId } : {};

    const items = await CartItem.find(filter).populate("productId");
    const total = items.reduce(
      (acc, item) => acc + (item.productId?.price || 0) * item.qty,
      0
    );

    res.json({ items, total });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1, userId } = req.body;

    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const filter = userId ? { productId, userId } : { productId };
    const existing = await CartItem.findOne(filter);

    if (existing) {
      existing.qty += qty;
      await existing.save();
      return res.json(existing);
    }

    const newItem = await CartItem.create({ productId, qty, userId });
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const removed = await CartItem.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Cart item not found" });
    res.json({ message: "Item removed" });
  } catch (err) {
    next(err);
  }
};

export const updateCartQty = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const newQty = req.body.qty;      

    if (typeof newQty !== 'number' || newQty < 1) {
        return res.status(400).json({ message: "Quantity must be a number greater than 0." });
    }

    const updatedItem = await CartItem.findByIdAndUpdate(
      cartItemId, 
      { qty: newQty }, 
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found for update." });
    }

    res.status(200).json(updatedItem);

  } catch (err) {
    next(err);
  }
};

export const checkout = async (req, res, next) => {
  try {
    const { cartItems, name, email } = req.body; 
    
    if (!cartItems || !cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const total = cartItems.reduce(
      (acc, item) => acc + (item.productId?.price || 0) * item.qty,
      0
    );
    const receipt = {
      total,
      timestamp: new Date(),
      items: cartItems,
  
      name: name,
      email: email
    };

    res.status(200).json(receipt);
  } catch (err) {
    next(err);
  }
};