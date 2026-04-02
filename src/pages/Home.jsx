import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import api from "../services/api";

const categoryItems = [
  { name: "Mirrorless", slug: "Mirrorless", description: "กล้องไฮบริดสำหรับภาพนิ่งและวิดีโอ", icon: "📷" },
  { name: "DSLR", slug: "DSLR", description: "ตัวเลือกคลาสสิกสำหรับสายถ่ายจริงจัง", icon: "🎞️" },
  { name: "Compact", slug: "Compact", description: "พกง่าย ภาพสวย ตอบโจทย์คอนเทนต์ครีเอเตอร์", icon: "🧳" },
  { name: "Cinema", slug: "Cinema", description: "งานวิดีโอโปรดักชันคุณภาพสูง", icon: "🎥" }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const featured = products.slice(0, 4);
  const newArrivals = [...products].slice(-4).reverse();

  return (
    <div className="space-y-20">
      <section className="container-app pt-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-hero-grid bg-[length:32px_32px] bg-card px-6 py-14 shadow-glow md:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-2 text-sm text-brand-100">
                กล้องดิจิทัลรุ่นใหม่ พร้อมส่งทั่วไทย
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
                เลือกกล้องที่ใช่
                <span className="block text-brand-300">สำหรับงานครีเอทีฟของคุณ</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
                รวม Mirrorless, DSLR, Compact และ Cinema Camera จากแบรนด์ชั้นนำ พร้อมคำแนะนำภาษาไทย
                สำหรับมือใหม่จนถึงมืออาชีพ
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="/products" className="btn-primary">
                  ช้อปสินค้าทั้งหมด
                </a>
                <a href="/products?category=Mirrorless" className="btn-secondary">
                  ดูกล้อง Mirrorless
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "รุ่นสินค้า", value: "120+" },
                { label: "ประกันศูนย์", value: "100%" },
                { label: "ส่งด่วน", value: "24 ชม." },
                { label: "บริการหลังการขาย", value: "7 วัน/สัปดาห์" }
              ].map((stat) => (
                <div key={stat.label} className="glass-panel rounded-3xl p-6">
                  <p className="text-3xl font-bold text-brand-200">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app space-y-6">
        <div>
          <h2 className="section-title">สินค้าแนะนำ</h2>
          <p className="section-subtitle">คัดมาแล้วสำหรับสายถ่ายภาพและสายวิดีโอที่ต้องการประสิทธิภาพสูง</p>
        </div>
        {loading ? (
          <p className="text-slate-400">กำลังโหลดสินค้า...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="container-app space-y-6">
        <div>
          <h2 className="section-title">เลือกช้อปตามหมวดหมู่</h2>
          <p className="section-subtitle">ค้นหากล้องตามสไตล์การใช้งานได้รวดเร็วขึ้น</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categoryItems.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="container-app space-y-6">
        <div>
          <h2 className="section-title">สินค้าใหม่มาแรง</h2>
          <p className="section-subtitle">อัปเดตรุ่นใหม่ล่าสุดที่กำลังเป็นกระแสในหมู่ครีเอเตอร์</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
