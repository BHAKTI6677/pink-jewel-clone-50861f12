import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns — SVOJAS.CO" },
      { name: "description", content: "SVOJAS.CO returns and exchange-only policy with unboxing video requirement." },
    ],
  }),
  component: Returns,
});

function Returns() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
      <p className="eyebrow">Customer Service</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">Returns</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-blush/80">
        <p>
          Thank you for choosing SVOJAS.CO. To ensure strict hygiene and quality control for all
          jewellery pieces, we operate under a No Returns &amp; No Refunds policy.
        </p>

        <Section title="1. All Sales Are Final">
          <p>
            Every item is meticulously inspected and securely wrapped before it leaves our facility.
            Because we guarantee that all items are packed correctly and safely, we do not accept
            returns or issue refunds for any orders under any circumstances.
          </p>
        </Section>

        <Section title="2. Exchange-Only Exceptions">
          <p>
            We only offer replacements or exchanges for items that are incorrectly sent. To request
            an exchange, you must strictly meet the following criteria:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">48-Hour Window:</strong> You must email us within 48 hours of receiving your delivery.</li>
            <li><strong className="text-blush-soft">Mandatory Unboxing Video:</strong> You must provide a clear, continuous, and unedited unboxing video that shows the package from its completely sealed state up until the issue is revealed. Requests without a valid unboxing video will be automatically declined.</li>
            <li><strong className="text-blush-soft">Original Condition:</strong> The product must remain completely unused and in its original packaging.</li>
          </ul>
        </Section>

        <Section title="3. Courier Damage & Lost Packages">
          <p>
            Once an order is handed over to our shipping partners, it is outside our control.
            SVOJAS.CO is not responsible for orders that are lost, stolen, or damaged by third-party
            courier services.
          </p>
          <p>
            If your package arrives physically damaged or goes missing in transit, any claims must be
            raised and filed directly with the courier service using your tracking number.
          </p>
        </Section>

        <Section title="How to Request an Exchange">
          <p>
            If you meet the above criteria, please email your order details and your unboxing video
            to:
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