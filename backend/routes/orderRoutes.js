import express from "express";
import { createOrder, getOrderById, getOrders, updateOrder, uploadSlipFile } from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import uploadSlip from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/upload-slip", uploadSlip.single("slip"), uploadSlipFile);
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", adminOnly, updateOrder);

export default router;
