import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/order-tracking-info")({
  head: () => ({
    meta: [
      { title: "Order Tracking — SVOJAS.CO" },
      { name: "description", content: "How to track your SVOJAS.CO order — courier partners, tracking links, and processing times." },
    ],
  }),
  component: OrderTrackingInfo,
});

function OrderTrackingInfo() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
      <p className="eyebrow">Customer Service</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">Track Your Order</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-blush/80">
        <p>
          Once your order has been carefully packed and dispatched from our facility, you will
          automatically receive a shipping confirmation email containing your tracking number and
          assigned courier partner (such as Delhivery, Blue Dart, or India Post).
        </p>

        <Section title="How to Track Your Package">
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Locate your tracking number in the shipping confirmation email sent to you.</li>
            <li>Click the direct tracking link provided in the email, or copy the tracking number.</li>
            <li>Paste the number into the tracking portal of the designated courier partner's official website to view real-time delivery updates.</li>
          </ol>
          <p className="pt-2">
            Logged-in customers can also view live order status and tracking numbers from{" "}
            <Link to="/my-orders" className="text-blush hover:underline">My Orders</Link>.
          </p>
        </Section>

        <Section title="Good to Know Before Tracking">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">Processing Time:</strong> It typically takes 24 to 48 hours for tracking links to go live and update after your package has been handed over to the courier.</li>
            <li><strong className="text-blush-soft">Prepaid Delivery:</strong> Because Cash on Delivery (COD) is not available, no additional payment is required upon delivery.</li>
            <li><strong className="text-blush-soft">Courier Responsibility:</strong> As a reminder, SVOJAS.CO is not liable for packages lost or damaged by our courier partners. If your tracking states "Delivered" but you have not received it, or if the shipment is severely delayed, please contact the courier company directly using your tracking number to raise a claim.</li>
          </ul>
        </Section>

        <Section title="Need Help?">
          <p>
            If you haven't received your tracking details after 3 business days, or if you need
            assistance locating your shipping info, please reach out to us:
          </p>
          <p>
            <strong className="text-blush-soft">Email:</strong>{" "}
            <a href="mailto:svojas27@gmail.com" className="text-blush hover:underline">svojas27@gmail.com</a>
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border/40 pt-5">
      <h2 className="font-display text-xl text-blush-soft sm:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}