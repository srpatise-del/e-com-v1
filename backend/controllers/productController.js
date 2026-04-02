import Product from "../models/Product.js";

const buildQuery = (query) => {
  // สร้าง dynamic filters สำหรับหน้า products ที่มีทั้ง search/filter/sort
  const filters = {};

  if (query.search) {
    filters.name = { $regex: query.search, $options: "i" };
  }

  if (query.brand) {
    filters.brand = query.brand;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.maxPrice) {
    filters.price = { $lte: Number(query.maxPrice) };
  }

  return filters;
};

const buildSort = (sort) => {
  if (sort === "price_asc") return { price: 1 };
  if (sort === "price_desc") return { price: -1 };
  return { createdAt: -1 };
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find(buildQuery(req.query)).sort(buildSort(req.query.sort));
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลสินค้าได้", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงรายละเอียดสินค้าได้", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "เพิ่มสินค้าสำเร็จ", product });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถเพิ่มสินค้าได้", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }
    res.json({ message: "อัปเดตสินค้าสำเร็จ", product });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถอัปเดตสินค้าได้", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }
    res.json({ message: "ลบสินค้าสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถลบสินค้าได้", error: error.message });
  }
};
