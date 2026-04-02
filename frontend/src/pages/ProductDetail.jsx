import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const fallbackImage = "/products/camera-placeholder.svg";

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setSelectedImage(data.product.images?.[0] || fallbackImage);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="container-app py-20 text-center text-slate-400">กำลังโหลดรายละเอียดสินค้า...</div>;
  }

  if (!product) {
    return <div className="container-app py-20 text-center text-slate-400">ไม่พบสินค้าที่ต้องการ</div>;
  }

  const handleBuyNow = async () => {
    await addToCart(product, 1);
    navigate("/checkout");
  };

  return (
    <div className="container-app py-10">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-card">
            <img
              src={selectedImage || fallbackImage}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage;
              }}
              className="h-[420px] w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images?.map((image) => (
              <button
                key={image}
                className={`overflow-hidden rounded-2xl border ${
                  selectedImage === image ? "border-brand-400" : "border-white/10"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image || fallbackImage}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="h-28 w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-200">{product.brand}</p>
            <h1 className="mt-3 text-4xl font-black text-white">{product.name}</h1>
            <p className="mt-4 text-lg text-slate-300">{product.description}</p>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <p className="text-sm text-slate-400">ราคาเริ่มต้น</p>
            <p className="mt-2 text-4xl font-black text-brand-200">฿{product.price.toLocaleString()}</p>
            <p className="mt-2 text-sm text-slate-400">สต็อกพร้อมขาย: {product.stock} ชิ้น</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button className="btn-primary" onClick={() => addToCart(product, 1)}>
                เพิ่มลงตะกร้า
              </button>
              <button className="btn-secondary" onClick={handleBuyNow}>
                ซื้อเลย
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-card p-6">
            <h2 className="text-xl font-semibold text-white">สเปกเด่น</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <tr key={key} className="border-b border-white/10 last:border-none">
                      <td className="bg-slate-950/40 px-4 py-3 font-medium capitalize text-slate-300">{key}</td>
                      <td className="px-4 py-3 text-white">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
