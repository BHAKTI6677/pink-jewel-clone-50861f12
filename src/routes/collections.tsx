import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

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
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <header className="text-center max-w-2xl mx-auto">
        <p className="eyebrow">Curated Collections</p>
        <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">Five collections, one vocabulary</h1>
        <p className="mt-4 text-sm leading-relaxed text-blush/70">
          Every SVOJAS.CO piece belongs to a family — drawn from one of our five lasting collections.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(c => (
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
    </div>
  );
}
