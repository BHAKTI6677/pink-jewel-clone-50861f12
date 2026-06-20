import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFormatPrice } from "@/context/CurrencyContext";

type OrderRow = {
  id: string;
  status: string;
  total_inr: number;
  tracking_number: string | null;
  courier: string | null;
  created_at: string;
  paid_at: string | null;
};

export const Route = createFileRoute("/_authenticated/my-orders")({
  head: () => ({
    meta: [
      { title: "My Orders — SVOJAS.CO" },
      { name: "description", content: "View and track your SVOJAS.CO orders." },
    ],
  }),
  component: MyOrders,
});

function MyOrders() {
  const formatPrice = useFormatPrice();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("orders")
      .select("id,status,total_inr,tracking_number,courier,created_at,paid_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setOrders((data ?? []) as OrderRow[]);
      });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-5">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 font-display text-4xl text-blush-soft sm:text-5xl">My Orders</h1>
        </div>
        <button onClick={handleSignOut} className="text-[11px] uppercase tracking-[0.28em] text-blush/70 hover:text-blush">
          Sign out
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-rose-300">{error}</p>}

      {orders === null && !error && (
        <p className="mt-10 text-sm text-blush/60">Loading…</p>
      )}

      {orders && orders.length === 0 && (
        <div className="mt-16 text-center">
          <p className="font-display text-2xl text-blush-soft">No orders yet</p>
          <p className="mt-2 text-sm text-blush/60">When you place an order it will appear here with live tracking.</p>
          <Link to="/shop" className="btn-primary mt-7 inline-flex">Shop the Collection</Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <ul className="mt-8 divide-y divide-border/40">
          {orders.map(o => (
            <li key={o.id} className="py-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-blush/60">
                  Order #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}
                </p>
                <p className="mt-1 font-display text-xl text-blush-soft">{formatPrice(o.total_inr)}</p>
                <p className="mt-1 text-xs text-blush/70">
                  Status: <span className="text-blush capitalize">{o.status}</span>
                  {o.tracking_number && (
                    <> · Tracking: <span className="text-blush">{o.tracking_number}</span> {o.courier && `(${o.courier})`}</>
                  )}
                </p>
              </div>
              <Link
                to="/my-orders/$id"
                params={{ id: o.id }}
                className="text-[11px] uppercase tracking-[0.28em] text-blush hover:underline"
              >
                View details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}