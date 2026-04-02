import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      }
    };
    loadOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form);
    setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
  };

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="section-title">โปรไฟล์ของฉัน</h1>
        <p className="section-subtitle">แก้ไขข้อมูลส่วนตัวและตรวจสอบประวัติคำสั่งซื้อ</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-card p-6">
          <h2 className="text-xl font-semibold text-white">ข้อมูลสมาชิก</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              className="input-field"
              placeholder="ชื่อ"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input className="input-field opacity-80" placeholder="อีเมล" value={form.email} disabled />
            <input
              className="input-field"
              placeholder="เบอร์โทร"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <textarea
              className="input-field md:col-span-2"
              rows="4"
              placeholder="ที่อยู่"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
          <button className="btn-primary mt-6">บันทึกการเปลี่ยนแปลง</button>
        </form>

        <div className="rounded-[2rem] border border-white/10 bg-card p-6">
          <h2 className="text-xl font-semibold text-white">ประวัติคำสั่งซื้อ</h2>
          <div className="mt-5 space-y-4">
            {orders.length === 0 ? (
              <p className="text-sm text-slate-400">ยังไม่มีคำสั่งซื้อ</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">คำสั่งซื้อ #{order._id.slice(-6).toUpperCase()}</p>
                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-100">{order.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">วิธีชำระ: {order.paymentMethod}</p>
                  <p className="mt-2 text-sm text-slate-400">สถานะชำระเงิน: {order.paymentStatus || "pending"}</p>
                  {order.paymentDetails?.transactionId && (
                    <p className="mt-2 text-sm text-slate-500">เลขอ้างอิง: {order.paymentDetails.transactionId}</p>
                  )}
                  {order.paymentDetails?.slipUrl && (
                    <a
                      href={`https://e-com-v1-bvn8.onrender.com${order.paymentDetails.slipUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-brand-200 underline"
                    >
                      เปิดดูหลักฐานการชำระเงิน
                    </a>
                  )}
                  <p className="mt-2 text-sm text-slate-400">ยอดรวม ฿{order.totalPrice.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
