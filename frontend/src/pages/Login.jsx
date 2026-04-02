import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="container-app py-14">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-card p-8 shadow-glow">
        <h1 className="text-3xl font-bold text-white">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-sm text-slate-400">ล็อกอินเพื่อจัดการคำสั่งซื้อและข้อมูลส่วนตัว</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
            placeholder="รหัสผ่าน"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button className="btn-primary w-full">เข้าสู่ระบบ</button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="text-brand-200">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}
