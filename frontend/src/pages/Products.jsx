import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import api from "../services/api";

const initialFilters = {
  search: "",
  brand: "",
  category: "",
  maxPrice: 200000,
  sort: ""
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...initialFilters,
    category: searchParams.get("category") || ""
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.brand) params.brand = filters.brand;
        if (filters.category) params.category = filters.category;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.sort) params.sort = filters.sort;

        const { data } = await api.get("/products", { params });
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  const summaryText = useMemo(() => {
    if (loading) return "กำลังค้นหาสินค้า...";
    return `พบสินค้า ${products.length} รายการ`;
  }, [loading, products.length]);

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="section-title">สินค้าทั้งหมด</h1>
        <p className="section-subtitle">เลือกดูและเปรียบเทียบกล้องดิจิทัลรุ่นยอดนิยม พร้อมตัวกรองที่ใช้งานง่าย</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          onReset={() => setFilters(initialFilters)}
        />

        <div>
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-sm text-slate-300">{summaryText}</p>
            <p className="text-sm text-slate-500">โชว์ผลลัพธ์ตามตัวกรองแบบเรียลไทม์</p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-card p-10 text-center text-slate-400">กำลังโหลดสินค้า...</div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-card p-10 text-center text-slate-400">
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
