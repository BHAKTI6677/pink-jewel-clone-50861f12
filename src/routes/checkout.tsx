import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/context/ShopContext";
import { useFormatPrice } from "@/context/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [placed, setPlaced] = useState<string | null>(null); // order id
  const [submitting, setSubmitting] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    email: "", phone: "", first_name: "", last_name: "",
    street: "", city: "", state: "", pin: "", country: "India", notes: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      if (data.user?.email) setForm(f => ({ ...f, email: f.email || data.user!.email! }));
    });
  }, []);

  const shipping = subtotal > 0 ? 0 : 0;
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  if (placed) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="eyebrow">Thank you</p>
        <h1 className="mt-3 font-display text-4xl text-blush-soft">Order placed</h1>
        <p className="mt-3 text-sm text-blush/70">
          Order <span className="text-blush">#{placed.slice(0, 8)}</span> received. Track it anytime from your account.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/my-orders/$id" params={{ id: placed }} className="btn-primary">View Order</Link>
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
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

  async function handlePlace(e: React.FormEvent) {
    e.preventDefault();
    if (!signedIn) {
      toast.error("Please sign in to place your order.");
      navigate({ to: "/auth" });
      return;
    }
    setSubmitting(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");

      const { data: order, error: oerr } = await supabase
        .from("orders").insert({
          user_id: u.user.id,
          status: "pending",
          subtotal_inr: subtotal,
          tax_inr: tax,
          shipping_inr: shipping,
          total_inr: total,
          contact_email: form.email || u.user.email,
          contact_phone: form.phone || null,
          shipping_address: {
            first_name: form.first_name, last_name: form.last_name,
            street: form.street, city: form.city, state: form.state,
            pin: form.pin, country: form.country,
          },
          notes: form.notes || null,
        })
        .select("id").single();
      if (oerr || !order) throw oerr ?? new Error("Could not create order");

      const items = cart.map(({ product, qty }) => ({
        order_id: order.id,
        name: product.name,
        image_url: product.image,
        price_inr: product.price_inr,
        qty,
      }));
      const { error: ierr } = await supabase.from("order_items").insert(items);
      if (ierr) throw ierr;

      toast.success("Order placed (demo). Stripe checkout coming next.");
      clearCart();
      setPlaced(order.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
      <header className="mb-8 border-b border-border/40 pb-5">
        <p className="eyebrow flex items-center gap-2"><Lock className="h-3 w-3" /> Secure Checkout</p>
        <h1 className="mt-2 font-display text-4xl text-blush-soft sm:text-5xl">Checkout</h1>
        {signedIn === false && (
          <p className="mt-3 text-xs text-rose-300">
            Please <Link to="/auth" className="underline">sign in</Link> to place an order so you can track it from your account.
          </p>
        )}
      </header>

      <form onSubmit={handlePlace} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left: form */}
        <div className="space-y-10">
          <Section title="Contact">
            <Input label="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </Section>

          <Section title="Shipping Address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First Name" required value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              <Input label="Last Name" required value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <Input label="Street Address" required value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="City" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              <Input label="State" required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
              <Input label="PIN Code" required value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value })} />
            </div>
            <Input label="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
          </Section>

          <Section title="Order Notes">
            <Input label="Notes for our atelier (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            <p className="text-[11px] text-blush/60">Payment will be collected on the next step via secure Stripe checkout. By placing your order you agree to our <Link to="/terms-of-service" className="underline">Terms</Link> and <Link to="/refund-policy" className="underline">Refund Policy</Link>.</p>
          </Section>

          <button disabled={submitting} type="submit" className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Placing order…" : `Place Order · ${formatPrice(total)}`}
          </button>
        </div>

        {/* Right: summary */}
        <aside className="bg-maroon/30 border border-border/60 p-6 h-fit lg:sticky lg:top-24">
          <p className="eyebrow">Order Summary</p>
          <ul className="mt-5 space-y-4 max-h-72 overflow-y-auto pr-1">
            {cart.map(({ product, qty }) => (
              <li key={product.id} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-maroon/40">
                  <img src={product.image} alt={product.alt} className="h-full w-full object-cover" />
                  <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-maroon-deep">
                    {qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm text-blush-soft truncate">{product.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-blush/60">{product.category}</p>
                </div>
                <p className="text-sm text-blush whitespace-nowrap">{formatPrice(product.price_inr * qty)}</p>
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
