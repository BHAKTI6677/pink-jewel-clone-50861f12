import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const user = (context as { user?: { id: string } }).user;
    if (!user) throw redirect({ to: "/auth" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!data) throw redirect({ to: "/" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-3xl text-blush-soft sm:text-4xl">Store Management</h1>
        </div>
        <nav className="flex gap-5 text-[11px] uppercase tracking-[0.28em] text-blush/70">
          <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "text-blush" }} className="hover:text-blush">Products</Link>
          <Link to="/admin/slides" activeProps={{ className: "text-blush" }} className="hover:text-blush">Slideshow</Link>
          <Link to="/admin/categories" activeProps={{ className: "text-blush" }} className="hover:text-blush">Categories</Link>
          <Link to="/admin/orders" activeProps={{ className: "text-blush" }} className="hover:text-blush">Orders</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}