import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.slug)}`}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-card p-6 transition hover:border-brand-400/50 hover:bg-brand-500/10"
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-2xl">
        {category.icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{category.name}</h3>
      <p className="mt-2 text-sm text-slate-400">{category.description}</p>
      <span className="mt-4 inline-block text-sm font-medium text-brand-200">เลือกดูสินค้า</span>
    </Link>
  );
}
