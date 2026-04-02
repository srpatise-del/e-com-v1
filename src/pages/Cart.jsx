import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, total, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="section-title">ตะกร้าสินค้า</h1>
        <p className="section-subtitle">ตรวจสอบรายการสินค้า ปรับจำนวน และไปยังขั้นตอนการสั่งซื้อ</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-card p-12 text-center">
          <p className="text-lg text-slate-300">ยังไม่มีสินค้าในตะกร้า</p>
          <Link to="/products" className="btn-primary mt-6">
            เลือกซื้อสินค้า
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.productId?._id || item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="glass-panel h-fit rounded-[2rem] p-6">
            <h2 className="text-xl font-semibold text-white">สรุปรายการ</h2>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>ยอดรวมสินค้า</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span>ฟรี</span>
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex justify-between text-lg font-bold">
                <span>ยอดชำระทั้งหมด</span>
                <span className="text-brand-200">฿{total.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="btn-primary mt-6 w-full">
                ไปหน้าชำระเงิน
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
