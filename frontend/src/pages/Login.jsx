import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const demoAdmin = {
  email: "admin@1.com",
  password: "admin"
};

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

  const fillDemoAdmin = () => {
    setForm(demoAdmin);
    setError("");
  };

  return (
    <div className="container-app py-14">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-card p-8 shadow-glow">
        <div className="grid grid-cols-2 gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 p-3">
          <Link
            to="/login"
            className="rounded-[1.1rem] bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            to="/register"
            className="rounded-[1.1rem] px-4 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            สมัครสมาชิก
          </Link>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">อีเมล</label>
            <input
              className="input-field"
              placeholder="name@example.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">รหัสผ่าน</label>
            <input
              className="input-field"
              placeholder="อย่างน้อย 6 ตัวอักษร"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button className="btn-primary w-full">เข้าสู่ระบบ</button>
        </form>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-white">บัญชีสำหรับทดลอง</p>
              <p className="mt-3 text-xl font-bold text-amber-300">Admin</p>
              <p className="mt-2 text-sm text-slate-300">อีเมล: {demoAdmin.email}</p>
              <p className="mt-1 text-sm text-slate-300">รหัสผ่าน: {demoAdmin.password}</p>
            </div>
            <button
              type="button"
              className="rounded-full border border-brand-400/40 px-4 py-2 text-sm font-medium text-brand-100 transition hover:bg-brand-500/10"
              onClick={fillDemoAdmin}
            >
              ใช้บัญชีนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
