import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลตะกร้าได้", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const populated = await cart.populate("items.productId");
    res.status(201).json({ message: "เพิ่มสินค้าลงตะกร้าแล้ว", items: populated.items });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถเพิ่มสินค้าในตะกร้าได้", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    cart.items = cart.items
      .map((item) =>
        item.productId.toString() === req.params.id ? { ...item.toObject(), quantity: Number(quantity) } : item
      )
      .filter((item) => item.quantity > 0);

    await cart.save();
    const populated = await cart.populate("items.productId");
    res.json({ message: "อัปเดตตะกร้าสำเร็จ", items: populated.items });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถอัปเดตตะกร้าได้", error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.id);
    await cart.save();

    res.json({ message: "ลบสินค้าออกจากตะกร้าแล้ว" });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถลบสินค้าออกจากตะกร้าได้", error: error.message });
  }
};
