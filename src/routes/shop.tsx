import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { categories as fallbackCategories, products as staticProducts } from "@/data/products";
import { useProducts, resolveImage } from "@/hooks/use-products";
import { useSiteCategories } from "@/hooks/use-site-content";
import { ProductCard } from "@/components/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";

const searchSchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — SVOJAS.CO" },
      { name: "description", content: "Shop the complete SVOJAS.CO collection of handcrafted 22k gold jewellery." },
    ],
  }),
  component: Shop,
});

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "bestseller", label: "Bestsellers" },
] as const;

function Shop() {
  const { category, tag } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sort, setSort] = useState<typeof SORTS[number]["id"]>("featured");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [mobileFilters, setMobileFilters] = useState(false);
  const { data: dbProducts } = useProducts();
  const { data: dbCats } = useSiteCategories();
  const categories = (dbCats && dbCats.length > 0)
    ? dbCats.map(c => ({ slug: c.slug, label: c.label }))
    : fallbackCategories.map(c => ({ slug: c.slug, label: c.label }));

  const all = useMemo(() => {
    if (dbProducts && dbProducts.length) {
      return dbProducts.map(p => ({
        id: p.slug, name: p.name, category: p.category,
        price_inr: p.price_inr, image: resolveImage(p.image_url) || p.image_url,
        alt: p.alt_text || p.name, tag: p.tag, bestseller: p.bestseller,
      }));
    }
    return staticProducts;
  }, [dbProducts]);

  const filtered = useMemo(() => {
    let list = [...all];
    if (category) list = list.filter(p => p.category === category);
    if (tag) list = list.filter(p => p.tag?.toLowerCase() === tag.toLowerCase());
    list = list.filter(p => p.price_inr <= maxPrice);
    if (sort === "price-asc") list.sort((a, b) => a.price_inr - b.price_inr);
    else if (sort === "price-desc") list.sort((a, b) => b.price_inr - a.price_inr);
    else if (sort === "bestseller") list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
    return list;
  }, [all, category, tag, sort, maxPrice]);

  const setCategory = (slug: string | undefined) =>
    navigate({ search: slug ? { category: slug, tag } : tag ? { tag } : {} });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
      <header className="mb-8 border-b border-border/40 pb-6">
        <p className="eyebrow">The Collection</p>
        <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">
          {tag === "New" ? "New Arrivals" : (category ?? "All Pieces")}
        </h1>
        <p className="mt-2 text-sm text-blush/60">{filtered.length} pieces</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Sidebar (desktop) / Drawer (mobile) */}
        <aside className={`lg:block ${mobileFilters ? "fixed inset-0 z-50 bg-maroon-deep p-6 overflow-y-auto" : "hidden"}`}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <p className="font-display text-xl text-blush-soft">Filters</p>
            <button onClick={() => setMobileFilters(false)} className="text-blush"><X className="h-5 w-5" /></button>
          </div>

          <FilterSection title="Category">
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCategory(undefined)}
                  className={`hover:text-blush transition ${!category ? "text-blush font-medium" : "text-blush/70"}`}
                >
                  All
                </button>
              </li>
              {categories.map(c => (
                <li key={c.slug}>
                  <button
                    onClick={() => setCategory(c.slug)}
                    className={`hover:text-blush transition ${category === c.slug ? "text-blush font-medium" : "text-blush/70"}`}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </FilterSection>

          <FilterSection title="Price">
            <input
              type="range"
              min={20000}
              max={100000}
              step={5000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-blush)]"
            />
            <p className="mt-2 text-xs text-blush/70">Up to ₹ {maxPrice.toLocaleString("en-IN")}</p>
          </FilterSection>

          <FilterSection title="Sort By">
            <ul className="space-y-2 text-sm">
              {SORTS.map(s => (
                <li key={s.id}>
                  <button
                    onClick={() => setSort(s.id)}
                    className={`hover:text-blush transition ${sort === s.id ? "text-blush font-medium" : "text-blush/70"}`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </FilterSection>
        </aside>

        <div>
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between lg:hidden mb-5">
            <button
              onClick={() => setMobileFilters(true)}
              className="inline-flex items-center gap-2 border border-blush/30 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-blush"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof SORTS[number]["id"])}
              className="bg-maroon-deep border border-blush/30 px-3 py-2 text-xs text-blush"
            >
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-blush/60 py-20 text-center">No pieces match your filters.</p>
          ) : category || tag ? (
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map(c => {
                const items = filtered.filter(p => p.category === c.slug);
                if (items.length === 0) return null;
                return (
                  <section key={c.slug} id={`section-${c.slug}`}>
                    <div className="flex items-end justify-between border-b border-border/40 pb-3">
                      <h2 className="font-display text-2xl text-blush-soft sm:text-3xl">{c.label}</h2>
                      <button
                        onClick={() => setCategory(c.slug)}
                        className="text-[11px] uppercase tracking-[0.28em] text-blush/80 hover:text-blush"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="mt-6 grid gap-x-5 gap-y-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7 pb-6 border-b border-border/40">
      <p className="text-[10px] uppercase tracking-[0.28em] text-blush/50 mb-3">{title}</p>
      {children}
    </div>
  );
}
