import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    specifications: {
      sensor: { type: String, default: "" },
      video: { type: String, default: "" },
      lensMount: { type: String, default: "" }
    },
    images: [{ type: String }]
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model("Product", productSchema);
