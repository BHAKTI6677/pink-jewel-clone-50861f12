import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — SVOJAS.CO" },
      { name: "description", content: "Shipping timelines, delivery information and policies for SVOJAS.CO orders." },
    ],
  }),
  component: ShippingPolicy,
});

function ShippingPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
      <p className="eyebrow">Policies</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">Shipping Policy</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-blush/80">
        <p>
          Orders within India are usually dispatched within 5–10 business days. Once shipped,
          delivery typically takes 3–8 days, depending on your location.
        </p>
        <p>
          Please note that delivery timelines may vary due to circumstances beyond our control,
          including courier delays, weather conditions, political disruptions, strikes, courier
          company issues etc. As a result, estimated delivery times may differ from order to order.
        </p>
        <p>
          Kindly ensure that your shipping address is accurate at checkout, as it cannot be
          modified once the order has been dispatched. In case of an incorrect address, please
          reach out to us immediately via email or contact details. We are not responsible for
          re-shipping orders to corrected addresses at our own expense, and non-accepted pre-paid
          orders will incur re-shipping charges again for the parcel to reach your location.
        </p>
        <p>
          We are not responsible for lost, delayed, or damaged packages once the order has been
          handed over to our courier partners.
        </p>
      </div>
    </div>
  );
}