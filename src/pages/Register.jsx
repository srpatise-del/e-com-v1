import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    }
  };

  return (
    <div className="container-app py-14">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-card p-8 shadow-glow">
        <h1 className="text-3xl font-bold text-white">สมัครสมาชิก</h1>
        <p className="mt-2 text-sm text-slate-400">สร้างบัญชีเพื่อสั่งซื้อสินค้าและติดตามออร์เดอร์</p>
        <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            className="input-field"
            placeholder="ชื่อ"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="อีเมล"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="เบอร์โทร"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="รหัสผ่าน"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <textarea
            className="input-field md:col-span-2"
            rows="4"
            placeholder="ที่อยู่"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          {error && <p className="text-sm text-rose-300 md:col-span-2">{error}</p>}
          <button className="btn-primary md:col-span-2">สร้างบัญชี</button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          มีบัญชีอยู่แล้ว?{" "}
          <Link to="/login" className="text-brand-200">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
