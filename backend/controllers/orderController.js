import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const uploadSlipFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "กรุณาเลือกไฟล์สลิปก่อนอัปโหลด" });
    }

    const slipUrl = `/uploads/slips/${req.file.filename}`;
    res.status(201).json({
      message: "อัปโหลดสลิปสำเร็จ",
      slipUrl,
      fileName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถอัปโหลดสลิปได้", error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const isBankTransfer = req.body.paymentMethod === "โอนเงินผ่านธนาคาร";
    const isCod = req.body.paymentMethod === "เก็บเงินปลายทาง";

    const order = await Order.create({
      userId: req.user._id,
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      subtotalPrice: req.body.subtotalPrice || req.body.totalPrice,
      shippingFee: req.body.shippingFee || 0,
      discountAmount: req.body.discountAmount || 0,
      taxAmount: req.body.taxAmount || 0,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: isCod ? "cod" : isBankTransfer ? "awaiting_review" : "pending",
      paymentDetails: {
        transactionId: req.body.paymentDetails?.transactionId || "",
        accountName: req.body.paymentDetails?.accountName || "",
        accountNumber: req.body.paymentDetails?.accountNumber || "",
        bankName: req.body.paymentDetails?.bankName || "",
        paidAt: req.body.paymentDetails?.paidAt || null,
        paymentNote: req.body.paymentDetails?.paymentNote || "",
        slipUrl: req.body.paymentDetails?.slipUrl || ""
      },
      shippingAddress: req.body.shippingAddress,
      status: "pending"
    });

    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    res.status(201).json({ message: "สร้างคำสั่งซื้อสำเร็จ", order });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถสร้างคำสั่งซื้อได้", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { userId: req.user._id };
    const orders = await Order.find(query)
      .populate("userId", "name email")
      .populate("items.productId", "name price images")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงรายการคำสั่งซื้อได้", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId", "name price images");

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    if (req.user.role !== "admin" && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงคำสั่งซื้อนี้" });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้", error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.status ? { status: req.body.status } : {}),
        ...(req.body.paymentStatus ? { paymentStatus: req.body.paymentStatus } : {}),
        ...(req.body.paymentDetails ? { paymentDetails: req.body.paymentDetails } : {})
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    res.json({ message: "อัปเดตคำสั่งซื้อสำเร็จ", order });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถอัปเดตคำสั่งซื้อได้", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    res.json({ message: "ลบคำสั่งซื้อสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถลบคำสั่งซื้อได้", error: error.message });
  }
};
