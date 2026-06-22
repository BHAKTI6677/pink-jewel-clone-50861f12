import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { products, heroImage } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import atelierImg from "@/assets/atelier.jpg";
import { useSlides, useSiteCategories, resolveImage } from "@/hooks/use-site-content";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <NewArrivals />
      <FeaturedCategories />
      <Trending products={trending} />
      <BrandStory />
      <Editorial />
    </>
  );
}

function Hero() {
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center lg:py-24">
        <h1 className="font-display text-5xl leading-[1.02] text-blush-soft sm:text-6xl lg:text-7xl">
          Worn today.
          <br />
          <em className="text-blush">Inherited</em> tomorrow.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-blush/70">
          SVOJAS.CO crafts premium jewellery for occasions, cherishable moments and real milestones.
          Everyday statements made to celebrate the extraordinary in you.
        </p>
      </div>
    </section>
  );
}

function NewArrivals() {
  const { data: slides } = useSlides(false, "new_arrivals");
  const items = (slides && slides.length > 0)
    ? slides
    : [{
        id: "default-na",
        image_url: heroImage,
        alt_text: "New arrivals from SVOJAS.CO",
        headline: "",
        subtext: "",
        link_url: "/shop?tag=New",
        sort: 0,
        active: true,
        placement: "new_arrivals",
      }];
  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [items.length]);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);
  const current = items[idx];

  return (
    <section className="mx-auto max-w-3xl px-6 py-12 lg:py-16 text-center">
      <p className="eyebrow shimmer">New Arrivals</p>
      <h2 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Just landed</h2>
      <div className="relative mt-8">
        <div className="absolute -inset-3 -rotate-1 bg-maroon/60 rounded-sm" aria-hidden />
        <Link
          to={current.link_url || "/shop"}
          className="block relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-2xl shadow-black/30 bg-maroon/40"
        >
          {items.map((s, i) => (
            <img
              key={s.id}
              src={resolveImage(s.image_url) || heroImage}
              alt={s.alt_text || "New arrival"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          {(current.headline || current.subtext) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-deep/90 via-maroon-deep/30 to-transparent p-5 text-center">
              {current.headline && <p className="font-display text-xl text-blush-soft sm:text-2xl">{current.headline}</p>}
              {current.subtext && <p className="mt-1 text-xs uppercase tracking-[0.24em] text-blush/80">{current.subtext}</p>}
            </div>
          )}
        </Link>
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIdx(i => (i - 1 + items.length) % items.length)}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-maroon-deep/80 text-blush hover:bg-maroon-deep"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIdx(i => (i + 1) % items.length)}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-maroon-deep/80 text-blush hover:bg-maroon-deep"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 w-6 rounded-full transition ${i === idx ? "bg-blush" : "bg-blush/30"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-7 flex justify-center">
        <Link to="/shop" search={{ tag: "New" }} className="btn-primary">Shop New Arrivals</Link>
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
  const { data: cats } = useSiteCategories();
  const items = cats ?? [];
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <div className="text-center">
        <p className="eyebrow">Shop by Category</p>
        <h2 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Find your piece</h2>
      </div>
      <HScroller className="mt-8">
        {items.map(c => (
          <Link
            key={c.slug}
            to="/shop"
            search={{ category: c.slug }}
            className="group relative block shrink-0 snap-start overflow-hidden bg-maroon/40 aspect-[3/4] w-[180px] sm:w-[200px] lg:w-[220px]"
          >
            <img
              src={resolveImage(c.image_url)}
              alt={c.label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/90 via-maroon-deep/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <p className="font-display text-base text-blush-soft">{c.label}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-blush/80">Explore →</p>
            </div>
          </Link>
        ))}
      </HScroller>
    </section>
  );
}

function Trending({ products }: { products: typeof import("@/data/products").products }) {
  return (
    <section className="border-y border-border bg-maroon/20">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Best Sellers</p>
            <h2 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Trending this season</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.28em] text-blush/80 hover:text-blush hover:underline underline-offset-4">
            Shop All →
          </Link>
        </div>
        <HScroller className="mt-8">
          {products.map(p => (
            <div key={p.id} className="shrink-0 snap-start w-[180px] sm:w-[210px] lg:w-[230px]">
              <ProductCard product={p} />
            </div>
          ))}
        </HScroller>
      </div>
    </section>
  );
}

function BrandStory() {
  const { data: storyImgs } = useSlides(false, "story");
  const storyImg = storyImgs?.[0]?.image_url ? resolveImage(storyImgs[0].image_url) : atelierImg;
  const storyAlt = storyImgs?.[0]?.alt_text || "An artisan setting a gemstone by hand in the SVOJAS atelier";
  return (
    <section className="mx-auto max-w-4xl px-6 py-14 lg:py-20 text-center">
      <p className="eyebrow">Our Story</p>
      <h2 className="mt-4 font-display text-3xl leading-tight text-blush-soft sm:text-4xl">
        Crafted by Obsession,<br />
        Inspired by Love:<br />
        <em className="text-blush">The SVOJAS.CO story.</em>
      </h2>
      <img
        src={storyImg}
        alt={storyAlt}
        loading="lazy"
        className="mx-auto mt-8 aspect-[4/5] w-full max-w-xl object-cover"
      />
      <div className="mx-auto mt-8 max-w-xl text-left">
        <ExpandableStory />
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

function ExpandableStory() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-5 max-w-xl">
      <div className="space-y-4 text-blush/70 leading-relaxed text-sm">
        <p>
          Every piece of ornament tells a story, but ours began with a dream, an obsession,
          and a daughter's profound admiration, inspiration and love by her mother.
        </p>
        <div className="relative">
          <p>
            Founded in 2025 by Bhakti Bandak, SVOJAS.CO didn't begin in a corporate boardroom,
            but rather in a quiet room filled with sketches, determination, and a relentless passion.
            Our founder embarked on this journey of entrepreneurship entirely alone, driven by her
            mother's inspiration and unwavering support.
          </p>
          <p className="mt-4">
            Growing up, Bhakti was deeply inspired by her mother who is a dedicated business owner
            herself. Watching her mother navigate the business world while gracefully adoring and
            admiring her jewellery, she realized that jewellery is never just an accessory; it is a
            living diary of a woman's milestones, strength, and memories.
          </p>
          {!expanded && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background"
            />
          )}
        </div>
        <div
          className={`grid transition-all duration-700 ease-out ${
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 pt-1">
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
                When you wear a piece from SVOJAS, you are not just wearing jewellery — you are wearing
                a piece of an artisan's heart, a founder's dream, and a timeless story crafted just for you.
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-blush-soft hover:text-blush border-b border-blush-soft/40 hover:border-blush pb-1 transition-colors"
        aria-expanded={expanded}
      >
        {expanded ? "Read Less" : "Read Our Story"}
        <span aria-hidden className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>↓</span>
      </button>
    </div>
  );
}
