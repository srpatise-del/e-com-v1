export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const product = item.product || item.productId;
  const fallbackImage = "/products/camera-placeholder.svg";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card p-4 md:flex-row md:items-center">
      <img
        src={product.images?.[0] || fallbackImage}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackImage;
        }}
        className="h-28 w-full rounded-2xl object-cover md:w-36"
      />
      <div className="flex-1">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{product.brand}</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
        <p className="mt-2 text-sm text-slate-400">{product.category}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
          onClick={() => onUpdateQuantity(item.productId?._id || item.productId, item.quantity - 1)}
        >
          -
        </button>
        <span className="w-10 text-center">{item.quantity}</span>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
          onClick={() => onUpdateQuantity(item.productId?._id || item.productId, item.quantity + 1)}
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-brand-200">฿{(product.price * item.quantity).toLocaleString()}</p>
        <button className="mt-3 text-sm text-rose-300" onClick={() => onRemove(item.productId?._id || item.productId)}>
          ลบสินค้า
        </button>
      </div>
    </div>
  );
}
