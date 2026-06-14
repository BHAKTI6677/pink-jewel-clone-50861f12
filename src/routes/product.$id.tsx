import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, Truck, RotateCcw, Shield } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useShop } from "@/context/ShopContext";
import { getProduct, products, formatPrice } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — SVOJAS.CO` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — SVOJAS.CO` },
          { property: "og:description", content: loaderData.description },
          { property: "og:image", content: loaderData.img },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft">Piece not found</h1>
      <Link to="/shop" className="btn-primary mt-6 inline-flex">Back to Shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const { addToCart, setDrawerOpen, toggleWishlist, wishlist } = useShop();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const liked = wishlist.includes(product.id);

  // Mock gallery — same image at different angles
  const gallery = [product.img, product.img, product.img];

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
      <nav className="mb-6 text-xs uppercase tracking-[0.22em] text-blush/60">
        <Link to="/" className="hover:text-blush">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-blush">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-blush">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
          <div className="order-2 sm:order-1 flex sm:flex-col gap-3 overflow-x-auto">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`shrink-0 aspect-square w-20 overflow-hidden border-2 ${
                  activeImg === i ? "border-blush" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 sm:order-2 group relative overflow-hidden bg-maroon/40 aspect-[4/5]">
            <img
              src={gallery[activeImg]}
              alt={product.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute left-4 top-4 bg-maroon-deep/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-blush">
              {product.tag}
            </span>
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-blush/60">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl text-blush-soft sm:text-5xl">{product.name}</h1>
          <p className="mt-4 font-display text-2xl text-blush">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-blush/60">Inclusive of all taxes</p>

          <p className="mt-6 text-sm leading-relaxed text-blush/80">{product.description}</p>

          {/* Quantity */}
          <div className="mt-8 flex items-center gap-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-blush/60">Quantity</p>
            <div className="inline-flex items-center border border-blush/30">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2.5 text-blush/80 hover:text-blush" aria-label="Decrease">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm text-blush-soft">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-2.5 text-blush/80 hover:text-blush" aria-label="Increase">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={() => addToCart(product.id, qty)} className="btn-outline">Add to Bag</button>
            <button
              onClick={() => { addToCart(product.id, qty); setDrawerOpen(false); window.location.assign("/checkout"); }}
              className="btn-primary"
            >
              Buy Now
            </button>
          </div>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] ${
              liked ? "text-blush" : "text-blush/70 hover:text-blush"
            }`}
          >
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
            {liked ? "Saved" : "Add to Wishlist"}
          </button>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-border/40 py-5 text-[11px] text-blush/70">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Truck className="h-4 w-4 text-blush" />
              <span>Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-blush" />
              <span>14-Day Returns</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <Shield className="h-4 w-4 text-blush" />
              <span>Lifetime Polish</span>
            </div>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="details" className="border-border/40">
              <AccordionTrigger className="text-xs uppercase tracking-[0.28em] text-blush/90 hover:no-underline">Product Details</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-blush/70">{product.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="materials" className="border-border/40">
              <AccordionTrigger className="text-xs uppercase tracking-[0.28em] text-blush/90 hover:no-underline">Materials & Care</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-blush/70">
                <p className="mb-2">{product.materials}</p>
                <p>{product.care}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping" className="border-border/40">
              <AccordionTrigger className="text-xs uppercase tracking-[0.28em] text-blush/90 hover:no-underline">Shipping & Returns</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-blush/70">{product.shipping}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <p className="eyebrow">You may also love</p>
          <h2 className="mt-3 font-display text-3xl text-blush-soft">More from {product.category}</h2>
          <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
