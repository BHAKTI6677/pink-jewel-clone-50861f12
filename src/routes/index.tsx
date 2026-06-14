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
          <p className="eyebrow shimmer">New Arrivals · MMXXVI</p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-blush-soft sm:text-6xl lg:text-7xl">
            Worn today.
            <br />
            <em className="text-blush">Inherited</em> tomorrow.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-blush/70">
            SVOJAS.CO is a small atelier of women goldsmiths in Jaipur, hand-finishing
            jewellery in 22-karat gold, Burmese rubies and uncut rose quartz —
            one piece at a time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">Shop the Collection</Link>
            <Link to="/our-story" className="btn-outline">Our Story</Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border/40 pt-6 text-xs uppercase tracking-[0.22em] text-blush/60">
            <div><span className="block font-display text-2xl text-blush normal-case tracking-normal">22k</span>Gold purity</div>
            <div><span className="block font-display text-2xl text-blush normal-case tracking-normal">14 day</span>Returns</div>
            <div><span className="block font-display text-2xl text-blush normal-case tracking-normal">Free</span>Polish</div>
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
            <div className="absolute -bottom-4 -left-4 hidden sm:block bg-maroon border border-border px-4 py-3 rounded-sm shadow-lg max-w-[200px]">
              <p className="eyebrow text-[10px]">Featured</p>
              <p className="mt-1 font-display text-lg text-blush-soft">Rohini Layered Set</p>
              <p className="text-xs text-blush/60 mt-1">Three strands · solid gold</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Hallmarked 22k Gold", "Hand-set Gemstones", "Made in Jaipur", "Carbon-Neutral Shipping", "Lifetime Re-polish"];
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
            Forty-two women.<br />
            One quiet workshop in the<br />
            <em className="text-blush">old city of Jaipur.</em>
          </h2>
          <p className="mt-5 max-w-xl text-blush/70 leading-relaxed text-sm">
            Founded in 2019 by Bhakti Bandak, SVOJAS.CO began with a single ruby
            pendant set on a kitchen table. Today, every piece still begins as a
            hand-drawn sketch and ends in the hands of one of our karigars.
          </p>
          <Link to="/our-story" className="btn-outline mt-7">Read Our Story</Link>
        </div>
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="border-y border-border bg-maroon/30">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:py-20">
        <p className="eyebrow">A Note From The Founder</p>
        <blockquote className="mt-6 font-display text-2xl leading-snug text-blush-soft sm:text-3xl md:text-4xl">
          <span className="text-gold">"</span>
          We do not design for the trend cycle. We design for the
          drawer your daughter will one day open, find a velvet box,
          and feel found.
          <span className="text-gold">"</span>
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-[0.32em] text-blush/80">— Bhakti Bandak, Founder</p>
      </div>
    </section>
  );
}
