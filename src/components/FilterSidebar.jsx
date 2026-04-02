const categories = ["Mirrorless", "DSLR", "Compact", "Cinema"];
const brands = ["Sony", "Canon", "Fujifilm", "Nikon", "Panasonic"];

export default function FilterSidebar({ filters, setFilters, onReset }) {
  return (
    <aside className="glass-panel rounded-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">ตัวกรองสินค้า</h3>
        <button className="text-sm text-brand-200" onClick={onReset}>
          ล้างค่า
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-slate-300">ค้นหา</label>
          <input
            type="text"
            className="input-field"
            placeholder="ค้นหาชื่อกล้อง..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">แบรนด์</label>
          <select
            className="input-field"
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          >
            <option value="">ทุกแบรนด์</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">หมวดหมู่</label>
          <select
            className="input-field"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">ราคาไม่เกิน</label>
          <input
            type="range"
            min="10000"
            max="200000"
            step="5000"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-brand-400"
          />
          <p className="mt-2 text-sm text-slate-400">สูงสุด ฿{filters.maxPrice.toLocaleString()}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">เรียงลำดับ</label>
          <select
            className="input-field"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="">ล่าสุด</option>
            <option value="price_asc">ราคาต่ำไปสูง</option>
            <option value="price_desc">ราคาสูงไปต่ำ</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
