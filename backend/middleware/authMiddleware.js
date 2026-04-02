import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "ไม่ได้รับสิทธิ์เข้าถึง" });
  }

  try {
    // แนบ user ปัจจุบันไว้กับ request เพื่อให้ controller ใช้งานต่อได้ทันที
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "ไม่พบบัญชีผู้ใช้นี้แล้ว กรุณาเข้าสู่ระบบใหม่" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "สิทธิ์ไม่เพียงพอสำหรับการดำเนินการนี้" });
  }
  next();
};
