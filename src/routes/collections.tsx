import { createFileRoute, Link } from "@tanstack/react-router";
import { useSiteCategories, resolveImage } from "@/hooks/use-site-content";
import { useProducts, resolveImage as resolveProductImage } from "@/hooks/use-products";
import { products as staticProducts, categories as fallbackCategories } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useMemo } from "react";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — SVOJAS.CO" },
      { name: "description", content: "Explore the curated collections of SVOJAS.CO — necklaces, earrings, bracelets, rings and bridal sets." },
    ],
  }),
  component: Collections,
});

function Collections() {
  const { data: dbCats } = useSiteCategories();
  const { data: dbProducts } = useProducts();

  const cats = (dbCats && dbCats.length > 0)
    ? dbCats.map(c => ({ slug: c.slug, label: c.label, img: resolveImage(c.image_url) }))
    : fallbackCategories.map(c => ({ slug: c.slug, label: c.label, img: c.img }));

  const allProducts = useMemo(() => {
    if (dbProducts && dbProducts.length) {
      return dbProducts.map(p => ({
        id: p.slug, name: p.name, category: p.category,
        price_inr: p.price_inr, image: resolveProductImage(p.image_url) || p.image_url,
        alt: p.alt_text || p.name, tag: p.tag, bestseller: p.bestseller,
      }));
    }
    return staticProducts;
  }, [dbProducts]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <header className="text-center max-w-2xl mx-auto">
        <p className="eyebrow">Curated Collections</p>
        <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">Shop by Category</h1>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map(c => (
          <Link
            key={c.slug}
            to="/shop"
            search={{ category: c.slug }}
            className="group block"
          >
            <div className="relative overflow-hidden bg-maroon/40 aspect-[4/5]">
              <img
                src={c.img}
                alt={c.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/80 to-transparent" />
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl text-blush-soft">{c.label}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-blush/60 group-hover:text-blush transition">Explore →</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Per-category product grids */}
      <div className="mt-20 space-y-20">
        {cats.map(c => {
          const items = allProducts.filter(p => p.category === c.slug).slice(0, 8);
          if (items.length === 0) return null;
          return (
            <section key={`grid-${c.slug}`} id={`cat-${c.slug}`}>
              <div className="flex items-end justify-between border-b border-border/40 pb-4">
                <div>
                  <p className="eyebrow">{c.label}</p>
                  <h2 className="mt-2 font-display text-3xl text-blush-soft sm:text-4xl">{c.label}</h2>
                </div>
                <Link to="/shop" search={{ category: c.slug }} className="text-[11px] uppercase tracking-[0.28em] text-blush/80 hover:text-blush">
                  Shop all {c.label} →
                </Link>
              </div>
              <div className="mt-8 grid gap-x-5 gap-y-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {items.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
