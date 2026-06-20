import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, Tag } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useFormatPrice } from "@/context/CurrencyContext";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — SVOJAS.CO" },
      { name: "description", content: "Review the pieces in your SVOJAS.CO bag." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQty, removeFromCart, subtotal } = useShop();
  const formatPrice = useFormatPrice();
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState<string | null>(null);

  const discount = applied === "SVOJAS10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 0 ? 0 : 0; // free shipping
  const tax = Math.round((subtotal - discount) * 0.03);
  const total = subtotal - discount + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="eyebrow">Your Bag</p>
        <h1 className="mt-3 font-display text-4xl text-blush-soft">Your bag is empty</h1>
        <p className="mt-3 text-sm text-blush/60">Discover pieces made to be inherited.</p>
        <Link to="/shop" className="btn-primary mt-7 inline-flex">Shop the Collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
      <header className="mb-8 border-b border-border/40 pb-5">
        <p className="eyebrow">Shopping Bag</p>
        <h1 className="mt-2 font-display text-4xl text-blush-soft sm:text-5xl">Your Bag</h1>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <ul className="divide-y divide-border/40">
          {cart.map(({ product, qty }) => (
            <li key={product.id} className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr_auto] gap-4 sm:gap-6 py-6">
              <Link to="/product/$id" params={{ id: product.id }} className="block aspect-[4/5] overflow-hidden bg-maroon/40">
                <img src={product.image} alt={product.alt} className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-blush/60">{product.category}</p>
                <Link to="/product/$id" params={{ id: product.id }} className="block font-display text-xl text-blush-soft hover:text-blush">
                  {product.name}
                </Link>
                <p className="mt-1 font-display text-base text-blush">{formatPrice(product.price_inr)}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center border border-blush/30">
                    <button onClick={() => updateQty(product.id, qty - 1)} className="p-2 text-blush/80 hover:text-blush"><Minus className="h-3 w-3" /></button>
                    <span className="w-9 text-center text-sm text-blush-soft">{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)} className="p-2 text-blush/80 hover:text-blush"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-blush/60 hover:text-blush">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
              <p className="hidden sm:block font-display text-lg text-blush-soft whitespace-nowrap">{formatPrice(product.price_inr * qty)}</p>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="bg-maroon/30 border border-border/60 p-6 h-fit lg:sticky lg:top-24">
          <p className="eyebrow">Order Summary</p>

          <form
            onSubmit={e => { e.preventDefault(); setApplied(promo.toUpperCase()); }}
            className="mt-5 flex border border-blush/30"
          >
            <div className="flex items-center pl-3 text-blush/60">
              <Tag className="h-4 w-4" />
            </div>
            <input
              value={promo}
              onChange={e => setPromo(e.target.value)}
              placeholder="Promo code"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-blush-soft placeholder:text-blush/40 focus:outline-none"
            />
            <button className="bg-blush/20 px-4 text-[11px] uppercase tracking-[0.22em] text-blush hover:bg-blush hover:text-maroon-deep transition">
              Apply
            </button>
          </form>
          {applied && applied !== "SVOJAS10" && (
            <p className="mt-2 text-xs text-blush/60">Code not recognized. Try SVOJAS10.</p>
          )}
          {applied === "SVOJAS10" && (
            <p className="mt-2 text-xs text-gold">SVOJAS10 applied — 10% off.</p>
          )}

          <dl className="mt-6 space-y-2.5 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`− ${formatPrice(discount)}`} />}
            <Row label="Shipping" value="Free" />
            <Row label="Tax (est.)" value={formatPrice(tax)} />
          </dl>
          <div className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.28em] text-blush/70">Total</span>
            <span className="font-display text-2xl text-blush-soft">{formatPrice(total)}</span>
          </div>
          <Link to="/checkout" className="btn-primary mt-5 w-full">Secure Checkout</Link>
          <Link to="/shop" className="mt-3 block text-center text-xs uppercase tracking-[0.28em] text-blush/70 hover:text-blush">Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-blush/80">
      <dt>{label}</dt>
      <dd className="text-blush-soft">{value}</dd>
    </div>
  );
}
