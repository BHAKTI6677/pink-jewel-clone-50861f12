import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — SVOJAS.CO" },
      { name: "description", content: "SVOJAS.CO operates a strict no-refund, no-return policy. All sales are final." },
    ],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
      <p className="eyebrow">Policies</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">Refund Policy</h1>
      <p className="mt-3 text-xs uppercase tracking-[0.24em] text-blush/60">Strict No-Refund Policy</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-blush/80">
        <p>
          At SVOJAS.CO, we take immense pride in the quality and curation of our products. Our team
          carefully inspects, securely wraps, and safely packs every single item before it leaves our
          facility to ensure it is in perfect condition.
        </p>
        <p>
          Because of our rigorous quality control and secure packing standards, all sales are final.
          We do not offer refunds, returns, or exchanges for any completed orders under any
          circumstances. By completing your purchase at checkout, you agree to these terms.
        </p>
        <p>
          Once an order has been securely packed and handed over to our third-party courier partners,
          the shipment is outside of our direct control.
        </p>

        <Section title="Lost Shipments">
          <p>
            SVOJAS.CO is not liable or responsible for packages that are lost, misplaced, or stolen
            in transit by the delivery service.
          </p>
        </Section>

        <Section title="Damaged Shipments">
          <p>
            While we pack everything safely to withstand transit, we are not responsible for any
            physical damage, breakage, or crushed packaging caused by the mishandling of courier
            personnel.
          </p>
        </Section>

        <Section title="Please Note">
          <p>
            Any claims or disputes regarding delayed delivery, missing packages, or transit damage
            must be filed directly by the customer with the respective courier partner using the
            tracking information provided at the time of shipment.
          </p>
        </Section>

        <Section title="Questions?">
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