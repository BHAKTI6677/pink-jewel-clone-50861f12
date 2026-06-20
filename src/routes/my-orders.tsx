import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/my-orders")({
  head: () => ({
    meta: [
      { title: "My Orders — SVOJAS.CO" },
      { name: "description", content: "View and track your SVOJAS.CO orders." },
    ],
  }),
  component: MyOrdersPlaceholder,
});

function MyOrdersPlaceholder() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="eyebrow">My Orders</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft">Coming soon</h1>
      <p className="mt-3 text-sm text-blush/70">
        Order history and live tracking will be available once you sign in. We're wiring this up
        right now — check back shortly.
      </p>
      <Link to="/auth" className="btn-primary mt-7 inline-flex">Sign In</Link>
    </div>
  );
}