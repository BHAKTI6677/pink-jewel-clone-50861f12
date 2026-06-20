import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFormatPrice } from "@/context/CurrencyContext";
import { resolveImage } from "@/hooks/use-products";

type Order = {
  id: string;
  status: string;
  subtotal_inr: number;
  tax_inr: number;
  shipping_inr: number;
  total_inr: number;
  tracking_number: string | null;
  courier: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  shipping_address: Record<string, string>;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  stripe_payment_intent: string | null;
};

type Item = {
  id: string;
  name: string;
  image_url: string;
  price_inr: number;
  qty: number;
};

export const Route = createFileRoute("/_authenticated/my-orders/$id")({
  head: () => ({
    meta: [{ title: "Order Details — SVOJAS.CO" }],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const formatPrice = useFormatPrice();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("orders").select("*").eq("id", id).maybeSingle(),
      supabase.from("order_items").select("id,name,image_url,price_inr,qty").eq("order_id", id),
    ]).then(([o, i]) => {
      if (o.error) setError(o.error.message);
      else setOrder(o.data as Order | null);
      if (i.data) setItems(i.data as Item[]);
    });
  }, [id]);

  if (error) return <div className="mx-auto max-w-2xl px-6 py-16 text-sm text-rose-300">{error}</div>;
  if (!order) return <div className="mx-auto max-w-2xl px-6 py-16 text-sm text-blush/60">Loading…</div>;

  const addr = order.shipping_address || {};
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <Link to="/my-orders" className="text-[11px] uppercase tracking-[0.28em] text-blush/70 hover:text-blush">← All orders</Link>
      <h1 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Order #{order.id.slice(0, 8)}</h1>
      <p className="mt-1 text-xs text-blush/60">{new Date(order.created_at).toLocaleString()}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Card title="Status">
          <p className="font-display text-lg text-blush capitalize">{order.status}</p>
          {order.paid_at && <p className="mt-1 text-xs text-blush/60">Paid {new Date(order.paid_at).toLocaleDateString()}</p>}
          {order.stripe_payment_intent && (
            <p className="mt-1 text-[10px] text-blush/40 break-all">PI: {order.stripe_payment_intent}</p>
          )}
        </Card>
        <Card title="Tracking">
          {order.tracking_number ? (
            <>
              <p className="font-display text-lg text-blush">{order.tracking_number}</p>
              {order.courier && <p className="mt-1 text-xs text-blush/60">via {order.courier}</p>}
            </>
          ) : (
            <p className="text-sm text-blush/60">Not yet shipped</p>
          )}
        </Card>
      </div>

      <Card className="mt-3" title="Items">
        <ul className="divide-y divide-border/40">
          {items.map(it => (
            <li key={it.id} className="flex gap-4 py-3">
              {it.image_url && (
                <img src={resolveImage(it.image_url)} alt={it.name} className="h-16 w-14 object-cover bg-maroon/40" />
              )}
              <div className="flex-1">
                <p className="font-display text-sm text-blush-soft">{it.name}</p>
                <p className="text-xs text-blush/60">Qty {it.qty}</p>
              </div>
              <p className="text-sm text-blush">{formatPrice(it.price_inr * it.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 text-sm border-t border-border/40 pt-4">
          <Row label="Subtotal" value={formatPrice(order.subtotal_inr)} />
          <Row label="Shipping" value={order.shipping_inr ? formatPrice(order.shipping_inr) : "Free"} />
          <Row label="Tax" value={formatPrice(order.tax_inr)} />
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <dt className="text-[11px] uppercase tracking-[0.28em] text-blush/70">Total</dt>
            <dd className="font-display text-xl text-blush-soft">{formatPrice(order.total_inr)}</dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-3" title="Shipping Address">
        <p className="text-sm text-blush/80 whitespace-pre-line">
          {addr.first_name} {addr.last_name}<br />
          {addr.street}<br />
          {addr.city}, {addr.state} {addr.pin}<br />
          {addr.country || "India"}
        </p>
        {(order.contact_email || order.contact_phone) && (
          <p className="mt-2 text-xs text-blush/60">
            {order.contact_email} {order.contact_phone && `· ${order.contact_phone}`}
          </p>
        )}
      </Card>
    </div>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border border-border/40 bg-maroon/20 p-5 ${className ?? ""}`}>
      <p className="eyebrow">{title}</p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-blush/80">
      <dt>{label}</dt>
      <dd className="text-blush-soft">{value}</dd>
    </div>
  );
}