import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const fallbackImage = "/products/camera-placeholder.svg";

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-card shadow-glow transition hover:-translate-y-1">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative h-64 overflow-hidden bg-slate-950/70">
          <img
            src={product.images?.[0] || fallbackImage}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-100">
            {product.category}
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{product.brand}</p>
          <Link to={`/products/${product._id}`} className="mt-2 block text-lg font-semibold text-white">
            {product.name}
          </Link>
        </div>
        <p className="line-clamp-2 text-sm text-slate-400">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-brand-200">฿{product.price.toLocaleString()}</p>
          <button className="btn-primary py-2 text-sm" onClick={() => addToCart(product, 1)}>
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}
