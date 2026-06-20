import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFormatPrice } from "@/context/CurrencyContext";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

type AdminOrder = {
  id: string;
  user_id: string;
  status: typeof STATUSES[number];
  total_inr: number;
  tracking_number: string | null;
  courier: string | null;
  contact_email: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const formatPrice = useFormatPrice();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id,user_id,status,total_inr,tracking_number,courier,contact_email,created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders((data ?? []) as AdminOrder[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function update(o: AdminOrder, patch: Partial<AdminOrder>) {
    const { error } = await supabase.from("orders").update(patch).eq("id", o.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  }

  return (
    <div className="mt-8 overflow-x-auto">
      {loading && <p className="text-sm text-blush/60">Loading…</p>}
      <table className="w-full text-sm">
        <thead className="text-left text-[10px] uppercase tracking-[0.24em] text-blush/60">
          <tr className="border-b border-border/40">
            <th className="py-3">Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tracking</th>
            <th>Courier</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b border-border/30 text-blush/90">
              <td className="py-3">
                <div>#{o.id.slice(0, 8)}</div>
                <div className="text-xs text-blush/50">{new Date(o.created_at).toLocaleDateString()}</div>
              </td>
              <td className="text-xs">{o.contact_email ?? o.user_id.slice(0, 8)}</td>
              <td>{formatPrice(o.total_inr)}</td>
              <td>
                <select
                  value={o.status}
                  onChange={e => update(o, { status: e.target.value as AdminOrder["status"] })}
                  className="bg-maroon-deep/60 border border-blush/30 px-2 py-1 text-xs text-blush-soft"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>
                <input
                  defaultValue={o.tracking_number ?? ""}
                  onBlur={e => e.target.value !== (o.tracking_number ?? "") && update(o, { tracking_number: e.target.value || null })}
                  placeholder="—"
                  className="bg-maroon-deep/60 border border-blush/30 px-2 py-1 text-xs text-blush-soft w-32"
                />
              </td>
              <td>
                <input
                  defaultValue={o.courier ?? ""}
                  onBlur={e => e.target.value !== (o.courier ?? "") && update(o, { courier: e.target.value || null })}
                  placeholder="—"
                  className="bg-maroon-deep/60 border border-blush/30 px-2 py-1 text-xs text-blush-soft w-28"
                />
              </td>
            </tr>
          ))}
          {!loading && orders.length === 0 && (
            <tr><td colSpan={6} className="py-6 text-center text-blush/50">No orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}