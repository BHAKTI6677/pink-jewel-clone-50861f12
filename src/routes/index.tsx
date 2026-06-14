import { createFileRoute, Link } from "@tanstack/react-router";
import { products, categories, heroImage } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import atelierImg from "@/assets/atelier.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SVOJAS.CO — Heirloom Jewellery in Pink & Maroon" },
      { name: "description", content: "SVOJAS.CO crafts heirloom jewellery — necklaces, earrings, bracelets, rings and bridal sets in 22k gold." },
    ],
  }),
  component: Home,
});

function Home() {
  const trending = products.filter(p => p.bestseller).slice(0, 4);

  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedCategories />
      <Trending products={trending} />
      <BrandStory />
      <Editorial />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-16">
        <div className="lg:col-span-6 lg:pr-6">
          <p className="eyebrow shimmer">New Arrivals</p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-blush-soft sm:text-6xl lg:text-7xl">
            Worn today.
            <br />
            <em className="text-blush">Inherited</em> tomorrow.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-blush/70">
            SVOJAS.CO crafts premium jewelry for occasions, cherishable moments and real milestones.
            Everyday statements made to celebrate the extraordinary in you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">Shop the Collection</Link>
            <Link to="/our-story" className="btn-outline">Our Story</Link>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="relative">
            <div className="absolute -inset-3 -rotate-1 bg-maroon/60 rounded-sm" aria-hidden />
            <img
              src={heroImage}
              alt="Layered gold necklaces with maroon ruby and pink rose quartz pendants"
              width={1080}
              height={1920}
              className="relative aspect-[4/5] w-full rounded-sm object-cover shadow-2xl shadow-black/30"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "18K Gold Plated",
    "Meticulously Crafted for Durability",
    "Timeless Silhouettes, Premium Quality",
    "Unbox an Unforgettable Experience",
  ];
  return (
    <div className="border-y border-border bg-maroon/40 overflow-hidden">
      <div className="flex gap-12 px-6 py-3 text-[11px] uppercase tracking-[0.32em] text-blush/80 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-12">
            {it}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
    </div>
  );
}

function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
      <div className="text-center">
        <p className="eyebrow">Shop by Category</p>
        <h2 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Find your piece</h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map(c => (
          <Link
            key={c.slug}
            to="/shop"
            search={{ category: c.slug }}
            className="group relative block overflow-hidden bg-maroon/40 aspect-[3/4]"
          >
            <img
              src={c.img}
              alt={c.label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/90 via-maroon-deep/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-center">
              <p className="font-display text-xl text-blush-soft">{c.label}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-blush/80">Explore →</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Trending({ products }: { products: typeof import("@/data/products").products }) {
  return (
    <section className="border-y border-border bg-maroon/20">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Best Sellers</p>
            <h2 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Trending this season</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.28em] text-blush/80 hover:text-blush hover:underline underline-offset-4">
            Shop All →
          </Link>
        </div>
        <div className="mt-10 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
        <div className="lg:col-span-6">
          <img
            src={atelierImg}
            alt="An artisan setting a gemstone by hand in the SVOJAS atelier"
            loading="lazy"
            width={1600}
            height={1100}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        <div className="lg:col-span-6">
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-blush-soft sm:text-4xl">
            Crafted by Obsession,<br />
            Inspired by Love:<br />
            <em className="text-blush">The SVOJAS.CO story.</em>
          </h2>
          <div className="mt-5 max-w-xl space-y-4 text-blush/70 leading-relaxed text-sm">
            <p>
              Every piece of ornament tells a story, but ours began with a dream, an obsession,
              and a daughter's profound admiration, inspiration and love by her mother.
            </p>
            <p>
              Founded in 2025 by Bhakti Bandak, SVOJAS.CO didn't begin in a corporate boardroom,
              but rather in a quiet room filled with sketches, determination, and a relentless passion.
              Our founder embarked on this journey of entrepreneurship entirely alone, driven by her
              mother's inspiration and unwavering support.
            </p>
            <p>
              Growing up, Bhakti was deeply inspired by her mother who is a dedicated business owner
              herself. Watching her mother navigate the business world while gracefully adoring and
              admiring her jewellery, she realized that jewelry is never just an accessory; it is a
              living diary of a woman's milestones, strength, and memories.
            </p>
            <p>
              Taking a massive leap of faith, she launched SVOJAS.CO alongside the demanding
              schedules of her engineering degree. Balancing late-night academic challenges with
              early-morning design curation, her dedication bloomed beautifully — allowing her to
              achieve complete financial independence at just 20 years old.
            </p>
            <p>
              Beyond a personal milestone, SVOJAS is a tribute to the incredible hands that bring
              these visions to life. We believe that true luxury cannot be mass-produced by machines.
              Every single piece of SVOJAS jewellery is thoughtfully sourced and brought to life by
              local karigars (artisans) who pour hours of hard work, generational skill, and pure
              love into every curve, shine, and setting.
            </p>
            <p>
              When you wear a piece from SVOJAS, you are not just wearing jewelry — you are wearing
              a piece of an artisan's heart, a founder's dream, and a timeless story crafted just for you.
            </p>
          </div>
          <Link to="/our-story" className="btn-outline mt-7">Read Our Story</Link>
        </div>
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="border-y border-border bg-maroon-deep/70">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:py-20">
        <p className="eyebrow">A Note From The Founder</p>
        <blockquote className="mt-6 font-display text-2xl leading-snug text-blush-soft sm:text-3xl md:text-4xl">
          <span className="text-gold">"</span>
          We do not just design for the trend cycle, but for the drawer your daughter will open
          one day, find a velvet box, and feel found.
          <span className="text-gold">"</span>
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-[0.32em] text-blush/80">— Bhakti Bandak, Founder</p>
      </div>
    </section>
  );
}
