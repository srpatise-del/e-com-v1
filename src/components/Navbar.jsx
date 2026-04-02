import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/", label: "หน้าแรก" },
  { to: "/products", label: "สินค้าทั้งหมด" },
  { to: "/profile", label: "โปรไฟล์" }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="container-app flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-xl font-black text-brand-300">
              CH
            </div>
            <div>
              <p className="text-lg font-bold text-white">CameraHub TH</p>
              <p className="text-xs text-slate-400">ร้านกล้องดิจิทัลสายเทค</p>
            </div>
          </Link>
          <Link
            to="/cart"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 lg:hidden"
          >
            ตะกร้า ({cartCount})
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive ? "bg-brand-500/20 text-brand-200" : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive ? "bg-brand-500/20 text-brand-200" : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              แอดมิน
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/cart" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">
            ตะกร้า ({cartCount})
          </Link>
          {user ? (
            <>
              <span className="text-sm text-slate-300">สวัสดี, {user.name}</span>
              <button className="btn-secondary py-2" onClick={handleLogout}>
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary py-2">
                เข้าสู่ระบบ
              </Link>
              <Link to="/register" className="btn-primary py-2">
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
