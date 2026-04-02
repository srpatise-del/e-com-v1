import { useEffect, useState } from "react";
import api from "../services/api";

const emptyProduct = {
  name: "",
  brand: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  sensor: "",
  video: "",
  lensMount: "",
  images: ""
};

const orderStatusOptions = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
const paymentStatusOptions = ["pending", "awaiting_review", "paid", "failed", "cod"];
const assetBaseUrl = (import.meta.env.VITE_API_URL || "https://e-com-v1-bvn8.onrender.com/api").replace(/\/api\/?$/, "");

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [savingOrderId, setSavingOrderId] = useState(null);
  const [dashboardError, setDashboardError] = useState("");

  const loadDashboard = async () => {
    const [productRes, orderRes, userRes] = await Promise.all([api.get("/products"), api.get("/orders"), api.get("/auth/users")]);

    setProducts(productRes.data.products || []);
    setOrders(orderRes.data.orders || []);
    setUsers(userRes.data.users || []);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description,
      specifications: {
        sensor: form.sensor,
        video: form.video,
        lensMount: form.lensMount
      },
      images: form.images.split(",").map((image) => image.trim())
    };

    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post("/products", payload);
    }

    setForm(emptyProduct);
    setEditingId(null);
    await loadDashboard();
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      sensor: product.specifications?.sensor || "",
      video: product.specifications?.video || "",
      lensMount: product.specifications?.lensMount || "",
      images: product.images?.join(", ") || ""
    });
    setActiveTab("products");
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    await loadDashboard();
  };

  const handleOrderFieldChange = (orderId, field, value) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order._id === orderId ? { ...order, [field]: value } : order))
    );
  };

  const handleOrderUpdate = async (order) => {
    setSavingOrderId(order._id);

    try {
      await api.put(`/orders/${order._id}`, {
        status: order.status,
        paymentStatus: order.paymentStatus
      });
      await loadDashboard();
    } finally {
      setSavingOrderId(null);
    }
  };

  const handleOrderDelete = async (orderId) => {
    const confirmed = window.confirm("ต้องการลบคำสั่งซื้อนี้ใช่หรือไม่?");
    if (!confirmed) {
      return;
    }

    setDashboardError("");
    setSavingOrderId(orderId);

    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((currentOrders) => currentOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      setDashboardError(error.response?.data?.message || "ลบคำสั่งซื้อไม่สำเร็จ");
    } finally {
      setSavingOrderId(null);
    }
  };

  const tabs = [
    { id: "products", label: "จัดการสินค้า" },
    { id: "orders", label: "จัดการออเดอร์" },
    { id: "users", label: "จัดการผู้ใช้" }
  ];

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="section-title">แผงควบคุมแอดมิน</h1>
        <p className="section-subtitle">จัดการสินค้า ผู้ใช้ และคำสั่งซื้อจากหน้าเดียว</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="glass-panel rounded-[2rem] p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                  activeTab === tab.id ? "bg-brand-500/20 text-brand-100" : "text-slate-300 hover:bg-white/5"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-8">
          {activeTab === "products" && (
            <>
              <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-card p-6">
                <h2 className="text-xl font-semibold text-white">{editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <input className="input-field" placeholder="ชื่อสินค้า" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <input className="input-field" placeholder="แบรนด์" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                  <input className="input-field" placeholder="หมวดหมู่" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                  <input className="input-field" placeholder="ราคา" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  <input className="input-field" placeholder="สต็อก" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                  <input className="input-field" placeholder="Sensor" value={form.sensor} onChange={(e) => setForm({ ...form, sensor: e.target.value })} />
                  <input className="input-field" placeholder="Video" value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} />
                  <input className="input-field" placeholder="Lens Mount" value={form.lensMount} onChange={(e) => setForm({ ...form, lensMount: e.target.value })} />
                  <input
                    className="input-field md:col-span-2"
                    placeholder="ลิงก์รูปภาพ คั่นด้วย comma"
                    value={form.images}
                    onChange={(e) => setForm({ ...form, images: e.target.value })}
                    required
                  />
                  <textarea
                    className="input-field md:col-span-2"
                    rows="4"
                    placeholder="รายละเอียดสินค้า"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <button className="btn-primary">{editingId ? "อัปเดตสินค้า" : "เพิ่มสินค้า"}</button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyProduct);
                      }}
                    >
                      ยกเลิกการแก้ไข
                    </button>
                  )}
                </div>
              </form>

              <div className="rounded-[2rem] border border-white/10 bg-card p-6">
                <h2 className="text-xl font-semibold text-white">รายการสินค้า</h2>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="text-slate-400">
                      <tr>
                        <th className="pb-4">ชื่อสินค้า</th>
                        <th className="pb-4">แบรนด์</th>
                        <th className="pb-4">ราคา</th>
                        <th className="pb-4">สต็อก</th>
                        <th className="pb-4">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className="border-t border-white/10">
                          <td className="py-4 text-white">{product.name}</td>
                          <td className="py-4 text-slate-300">{product.brand}</td>
                          <td className="py-4 text-slate-300">฿{product.price.toLocaleString()}</td>
                          <td className="py-4 text-slate-300">{product.stock}</td>
                          <td className="py-4">
                            <div className="flex gap-3">
                              <button className="text-brand-200" onClick={() => handleEdit(product)}>
                                แก้ไข
                              </button>
                              <button className="text-rose-300" onClick={() => handleDelete(product._id)}>
                                ลบ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <div className="rounded-[2rem] border border-white/10 bg-card p-6">
              <h2 className="text-xl font-semibold text-white">คำสั่งซื้อทั้งหมด</h2>
              {dashboardError && <p className="mt-4 text-sm text-rose-300">{dashboardError}</p>}
              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-2xl border border-white/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-white">ออเดอร์ #{order._id.slice(-6).toUpperCase()}</p>
                      <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-100">{order.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">ลูกค้า: {order.userId?.name || "-"}</p>
                    <p className="mt-2 text-sm text-slate-400">วิธีชำระ: {order.paymentMethod}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <label className="text-sm text-slate-300">
                        <span className="mb-2 block">สถานะคำสั่งซื้อ</span>
                        <select
                          className="input-field"
                          value={order.status}
                          onChange={(e) => handleOrderFieldChange(order._id, "status", e.target.value)}
                        >
                          {orderStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm text-slate-300">
                        <span className="mb-2 block">สถานะการชำระเงิน</span>
                        <select
                          className="input-field"
                          value={order.paymentStatus || "pending"}
                          onChange={(e) => handleOrderFieldChange(order._id, "paymentStatus", e.target.value)}
                        >
                          {paymentStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {order.paymentDetails?.transactionId && (
                      <p className="mt-2 text-sm text-slate-500">เลขอ้างอิง: {order.paymentDetails.transactionId}</p>
                    )}
                    {order.paymentDetails?.slipUrl && (
                      <a
                        href={`${assetBaseUrl}${order.paymentDetails.slipUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-brand-200 underline"
                      >
                        เปิดดูสลิปที่อัปโหลด
                      </a>
                    )}
                    <p className="mt-2 text-sm text-slate-400">ยอดรวม: ฿{order.totalPrice.toLocaleString()}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={savingOrderId === order._id}
                        onClick={() => handleOrderUpdate(order)}
                      >
                        {savingOrderId === order._id ? "กำลังบันทึก..." : "บันทึกสถานะ"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-rose-400/40 px-5 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={savingOrderId === order._id}
                        onClick={() => handleOrderDelete(order._id)}
                      >
                        ลบคำสั่งซื้อ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="rounded-[2rem] border border-white/10 bg-card p-6">
              <h2 className="text-xl font-semibold text-white">ผู้ใช้งานทั้งหมด</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {users.map((member) => (
                  <div key={member._id} className="rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{member.name}</p>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{member.role}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{member.email}</p>
                    <p className="mt-2 text-sm text-slate-500">{member.phone || "ไม่มีเบอร์โทร"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
