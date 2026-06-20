import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useFormatPrice } from "@/context/CurrencyContext";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — SVOJAS.CO" },
      { name: "description", content: "Securely complete your SVOJAS.CO order." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { cart, subtotal, clearCart } = useShop();
  const formatPrice = useFormatPrice();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<"card" | "paypal" | "apple">("card");
  const [placed, setPlaced] = useState(false);

  const shipping = subtotal > 0 ? 0 : 0;
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  if (placed) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="eyebrow">Thank you</p>
        <h1 className="mt-3 font-display text-4xl text-blush-soft">Order placed</h1>
        <p className="mt-3 text-sm text-blush/70">
          A confirmation has been sent. Your pieces will be hand-finished and shipped within 4–6 days.
        </p>
        <Link to="/shop" className="btn-primary mt-7 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-blush-soft">Your bag is empty</h1>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Shop the Collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
      <header className="mb-8 border-b border-border/40 pb-5">
        <p className="eyebrow flex items-center gap-2"><Lock className="h-3 w-3" /> Secure Checkout</p>
        <h1 className="mt-2 font-display text-4xl text-blush-soft sm:text-5xl">Checkout</h1>
      </header>

      <form
        onSubmit={e => { e.preventDefault(); setPlaced(true); clearCart(); }}
        className="grid gap-10 lg:grid-cols-[1fr_400px]"
      >
        {/* Left: form */}
        <div className="space-y-10">
          <Section title="Contact">
            <Input label="Email" type="email" required />
            <Input label="Phone" type="tel" />
          </Section>

          <Section title="Shipping Address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First Name" required />
              <Input label="Last Name" required />
            </div>
            <Input label="Street Address" required />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="City" required />
              <Input label="State" required />
              <Input label="PIN Code" required />
            </div>
          </Section>

          <Section title="Payment Method">
            <div className="grid gap-3">
              <PaymentOption id="card" label="Credit / Debit Card" active={payment === "card"} onSelect={() => setPayment("card")} icon={<CreditCard className="h-4 w-4" />} />
              <PaymentOption id="paypal" label="PayPal" active={payment === "paypal"} onSelect={() => setPayment("paypal")} />
              <PaymentOption id="apple" label="Apple Pay" active={payment === "apple"} onSelect={() => setPayment("apple")} />
            </div>
            {payment === "card" && (
              <div className="mt-5 grid gap-4">
                <Input label="Card Number" placeholder="1234 5678 9012 3456" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Expiry (MM/YY)" placeholder="08/28" required />
                  <Input label="CVV" placeholder="123" required />
                </div>
              </div>
            )}
          </Section>

          <button type="submit" className="btn-primary w-full">Place Order · {formatPrice(total)}</button>
        </div>

        {/* Right: summary */}
        <aside className="bg-maroon/30 border border-border/60 p-6 h-fit lg:sticky lg:top-24">
          <p className="eyebrow">Order Summary</p>
          <ul className="mt-5 space-y-4 max-h-72 overflow-y-auto pr-1">
            {cart.map(({ product, qty }) => (
              <li key={product.id} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-maroon/40">
                  <img src={product.img} alt={product.alt} className="h-full w-full object-cover" />
                  <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-maroon-deep">
                    {qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm text-blush-soft truncate">{product.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-blush/60">{product.category}</p>
                </div>
                <p className="text-sm text-blush whitespace-nowrap">{formatPrice(product.price * qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2.5 text-sm border-t border-border/40 pt-4">
            <div className="flex justify-between text-blush/80"><dt>Subtotal</dt><dd className="text-blush-soft">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between text-blush/80"><dt>Shipping</dt><dd className="text-blush-soft">Free</dd></div>
            <div className="flex justify-between text-blush/80"><dt>Tax</dt><dd className="text-blush-soft">{formatPrice(tax)}</dd></div>
          </dl>
          <div className="mt-4 border-t border-border/60 pt-4 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.28em] text-blush/70">Total</span>
            <span className="font-display text-2xl text-blush-soft">{formatPrice(total)}</span>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-blush-soft mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full bg-maroon-deep/60 border border-blush/30 px-4 py-2.5 text-sm text-blush-soft placeholder:text-blush/40 focus:border-blush focus:outline-none transition"
      />
    </label>
  );
}

function PaymentOption({ label, active, onSelect, icon }: { id: string; label: string; active: boolean; onSelect: () => void; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center justify-between px-4 py-3 border text-sm transition ${
        active ? "border-blush bg-blush/10 text-blush" : "border-border/60 text-blush/70 hover:border-blush/60"
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      <span className={`h-3 w-3 rounded-full border-2 ${active ? "border-blush bg-blush" : "border-blush/40"}`} />
    </button>
  );
}
