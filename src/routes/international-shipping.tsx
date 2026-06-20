import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/international-shipping")({
  head: () => ({
    meta: [
      { title: "International Shipping — SVOJAS.CO" },
      { name: "description", content: "SVOJAS.CO now ships worldwide. Read about timelines, customs, currency and shipping value tips." },
    ],
  }),
  component: InternationalShipping,
});

function InternationalShipping() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
      <p className="eyebrow">Worldwide Delivery</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">
        SVOJAS is Now Shipping Worldwide
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-blush/80">
        <p>
          For a long time, we have received messages from our community all over the globe asking us
          one specific question:
        </p>
        <p className="font-display text-lg text-blush italic">
          "When will SVOJAS pieces be available to order internationally?"
        </p>
        <p>
          Today, we are absolutely thrilled to share that the wait is officially over. SVOJAS.CO is
          open for international orders, allowing us to ship our curated jewellery no matter where
          you are in the world.
        </p>

        <h2 className="font-display text-2xl text-blush-soft pt-3">Essential Details for International Orders</h2>
        <p>Before you place your order, please take a moment to review how our global shipping process works:</p>

        <Section title="1. Global Logistics & Delivery Timelines">
          <p>
            We dispatch all international shipments directly from our facility in India. While we
            process and securely pack your items with the utmost care right away, delivery timelines
            will naturally vary based on your geographic location, flight schedules, and customs
            processing in the destination country.
          </p>
          <p>
            Please note that international parcels can occasionally experience minor delays while
            passing through your country's customs processing center, which is outside of our direct
            control.
          </p>
        </Section>

        <Section title="2. Smart Cart Strategy (Recommended Order Value)">
          <p>
            Because global courier rates are fixed based on minimum weight brackets, shipping smaller
            orders internationally can carry a high relative cost.
          </p>
          <p>
            To ensure you get the absolute best value, we highly recommend placing orders worth or
            above <strong className="text-blush-soft">₹8,000 – ₹10,000</strong>. Maximizing your cart
            value helps balance out the international shipping fees, making your purchase
            significantly more economical.
          </p>
        </Section>

        <Section title="3. Currency & Checkout Adjustments">
          <p>
            While navigating SVOJAS.CO, our system may display product prices in your native local
            currency to give you an accurate sense of cost. However, please note that when you reach
            the final checkout page, the transaction will be processed in Indian Rupees (INR). Your
            bank or credit card provider will automatically manage the currency conversion at their
            standard daily rate.
          </p>
        </Section>

        <Section title="4. Import Duties, Taxes, & Customs Fees">
          <p>
            The shipping fee paid on our website covers the cost of transportation across borders. It
            does not include local customs duties, import taxes, VAT, GST, or any specific handling
            charges levied by your country's government.
          </p>
          <p>
            These regulatory fees are determined exclusively by your local customs authorities upon
            arrival and are the sole responsibility of the customer.
          </p>
        </Section>

        <Section title="A Note of Gratitude">
          <p>
            Growing from a dedicated home brand into an international label is a milestone we do not
            take for granted. Being able to pack our signature designs and send them to corners of
            the earth we've only dreamed of visiting is an absolute privilege.
          </p>
          <p>
            Thank you for supporting SVOJAS, believing in our vision, and letting our pieces become a
            small part of your life story.
          </p>
          <p className="font-display text-base text-blush">Happy Shopping!</p>
          <p>With love,<br />SVOJAS</p>
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