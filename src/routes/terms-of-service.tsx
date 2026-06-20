import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SVOJAS.CO" },
      { name: "description", content: "The terms and conditions that govern your use of SVOJAS.CO and your purchases." },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">Terms of Service</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-blush/80">
        <p>
          Welcome to SVOJAS.CO. This document outlines the rules, regulations, and guidelines that
          govern your use of our website, digital platform, and purchases.
        </p>
        <p>
          By browsing our site, interacting with our brand, or placing an order, you agree to be
          legally bound by these Terms of Service. If you do not agree to all of the clauses stated
          below, please discontinue your use of our platform immediately.
        </p>

        <Section title="1. Overview & Scope">
          <p>
            By utilizing our website, you engage in our operations and agree to remain compliant
            with these Terms, alongside any auxiliary guidelines or policies hyperlinked within our
            storefront.
          </p>
        </Section>

        <Section title="2. User Eligibility">
          <p>By interacting with our platform, you affirm that:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You have reached at least 18 years of age, or you are navigating the storefront under the active supervision of a parent or legal guardian.</li>
            <li>You possess the full legal capacity to enter into binding agreements under the prevailing laws of your jurisdiction.</li>
          </ul>
        </Section>

        <Section title="3. Digital Store Usage Standards">
          <p>You strictly agree not to misuse our digital workspace. Prohibited actions include, but are not limited to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Using our jewellery, hair accessories, or digital assets for any illegal, unauthorized, or unethical purposes.</li>
            <li>Violating any regional, national, or international regulations, statutes, or local codes.</li>
            <li>Transmitting or deploying computer viruses, malware, trojans, or any form of disruptive malicious code.</li>
            <li>Attempting to gain unauthorized access to our web hosting environment, operational databases, or backend infrastructure.</li>
            <li>Engaging in suspicious, deceptive, or fraudulent transaction behaviors.</li>
          </ul>
          <p><strong className="text-blush-soft">Enforcement:</strong> A violation of any clause within these terms will result in an immediate, unilateral termination of your access to our Services.</p>
        </Section>

        <Section title="4. Product Presentation, Variations, & Modifications">
          <p>We curate our collections with high attention to detail. However, please note the following operational guidelines:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">Inventory &amp; Availability:</strong> We reserve the right to alter product lines, adjust available stock quantities, or completely discontinue any item at any time without prior warning.</li>
            <li><strong className="text-blush-soft">Aesthetic Display:</strong> We style our jewellery and hair accessories using a simple, chic, and vintage aesthetic, presenting items on standard wooden stands. While we strive to present accurate, close-up product photographs, minor color shifts or visual variations may occur depending on the screen settings and calibration of your viewing device.</li>
            <li><strong className="text-blush-soft">Correction of Errors:</strong> We reserve the right to refuse service or cancel orders if product details, dimensions, or pricing parameters contain typographic errors or inaccuracies.</li>
          </ul>
        </Section>

        <Section title="5. Pricing, Billing, & Currency">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">Currency Standard:</strong> All monetary values listed on our storefront are denominated in Indian Rupees (₹).</li>
            <li><strong className="text-blush-soft">Price Adjustments:</strong> Listed prices are subject to change at our sole discretion without notice.</li>
            <li><strong className="text-blush-soft">Payment Protocols:</strong> Orders will only enter production and dispatch queues once full payment clearance is confirmed via our authorized digital payment gateways.</li>
            <li><strong className="text-blush-soft">Payment Restrictions:</strong> Please note that Cash on Delivery (COD) is strictly unavailable. All orders must be prepaid securely online.</li>
          </ul>
        </Section>

        <Section title="6. Order Review & Cancellations">
          <p>
            Receiving a digital order confirmation does not guarantee our ultimate acceptance of your
            purchase. We reserve the absolute right to cancel or limit orders for any legitimate
            business reason, including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Unanticipated stock depletion or component shortages.</li>
            <li>Errors discovered in pricing columns or item descriptions.</li>
            <li>Flagged issues from our payment gateways indicating potential fraud or failed address verifications.</li>
          </ul>
          <p>If we cancel an order after your payment has cleared, the full transactional value will be reversed back to your original payment method.</p>
        </Section>

        <Section title="7. Shipping Regulations">
          <p>
            We offer domestic shipping across India. While we strive to meet typical shipping
            windows, all delivery timelines are calculated as estimates. SVOJAS.CO cannot be held
            liable for delayed arrivals stemming from:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Courier logistical backlogs or internal routing delays.</li>
            <li>Severe weather disruptions or natural events.</li>
            <li>National, regional, or gazetted public holidays.</li>
            <li>Operational disruptions impacting regional transit routes.</li>
          </ul>
        </Section>

        <Section title="8. Strict No-Refund & No-Return Policy">
          <p>
            At SVOJAS.CO, we implement rigorous quality checks, ensuring that all delicate jewellery
            and hair accessories are securely, safely, and immaculately packed before handoff.
            Consequently, we operate under a strict sales policy:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">All Sales Are Final:</strong> We do not offer refunds, order cancellations, or returns for any completed purchases under any circumstances.</li>
            <li><strong className="text-blush-soft">Courier Mismanagement Disclaimer:</strong> Once a package leaves our facility and is handed over to our third-party delivery networks, it is completely out of our control. SVOJAS.CO is not responsible or liable for any packages that are lost in transit, misplaced, stolen, or physically damaged due to the handling styles of courier personnel.</li>
            <li><strong className="text-blush-soft">Filing Claims:</strong> Any disputes regarding damaged boxes, missing items from broken transit parcels, or tracking anomalies must be opened and negotiated directly by the customer with the respective third-party courier service using the tracking number provided.</li>
          </ul>
        </Section>

        <Section title="9. Accuracy of Website Material">
          <p>
            We aim for complete accuracy across all text, dimensions, and specifications on our site.
            However, we do not claim or warrant that our site descriptions, marketing blog posts, or
            inventory details are continuously error-free, complete, or perfectly current. We reserve
            the right to make real-time corrections without prior warning.
          </p>
        </Section>

        <Section title="10. Proprietary Intellectual Property Rights">
          <p>
            The digital architecture and visual identity of this store — including our brand name,
            logos, custom product images, vintage-themed backdrops, unique jewellery layout designs,
            graphics, and written copy — are the exclusive property of SVOJAS.
          </p>
          <p>
            You are strictly prohibited from copying, scraping, reproducing, distributing, or
            repurposing any of our physical or digital property without our explicit, advance written
            permission.
          </p>
        </Section>

        <Section title="11. Third-Party Software and Integrations">
          <p>
            Our storefront utilizes various third-party applications to handle critical tasks, such
            as external payment processing gateways, shipping coordination portals, and consumer
            analytics tools. You recognize that these third parties operate under their own
            individual privacy rules and terms. We are not responsible or legally accountable for the
            operations, behaviors, or policies of these external integrations.
          </p>
        </Section>

        <Section title="12. Complete Limitation of Liability">
          <p>
            To the fullest extent permitted by law, SVOJAS and its team shall not be liable for any
            indirect, incidental, special, or consequential damages resulting from your use of our
            site or products. This includes, but is not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Financial loss or dropped business profits.</li>
            <li>Transit mishandling or item loss caused by logistics partners.</li>
            <li>Improper care or product misuse by the customer.</li>
            <li>Minor color variations from screen to physical item.</li>
            <li>Allergic reactions or skin sensitivities resulting from individual material interactions. (Use of our jewellery and accessories remains entirely at the customer's discretion.)</li>
          </ul>
        </Section>

        <Section title="13. Privacy Management">
          <p>
            Any personal profiles, shipping logs, or financial credentials shared with our store
            during your tenure on the site are protected and processed according to our official
            Privacy Policy.
          </p>
        </Section>

        <Section title="14. Access Revocation">
          <p>
            We maintain the unilateral right to suspend, restrict, or entirely block your access to
            our website and purchasing features at any moment if we suspect a violation of these
            Terms, non-compliant behaviors, or fraudulent activity.
          </p>
        </Section>

        <Section title="15. Amendments to the Terms of Service">
          <p>
            We reserve the right to revise, replace, or edit any component of these Terms of Service
            by publishing updates directly to this page. It is your responsibility to check this
            document periodically for structural changes. Continuing to use or visit the website
            after edits are made confirms your acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="16. Governing Law & Legal Framework">
          <p>
            These Terms of Service are governed by, and interpreted exclusively under, the prevailing
            laws of India. Any official legal claims, actions, or disputes emerging from these terms
            or your transactions with us shall be brought solely before the courts located in
            Mumbai, India.
          </p>
        </Section>

        <Section title="17. Contact Information">
          <p>For clarifications, administrative questions, or formal feedback regarding these Terms of Service, please reach out via our official communication channels:</p>
          <p>
            <strong className="text-blush-soft">Brand Entity:</strong> SVOJAS<br />
            <strong className="text-blush-soft">Digital Domain:</strong> SVOJAS.CO<br />
            <strong className="text-blush-soft">Email:</strong>{" "}
            <a href="mailto:svojas27@gmail.com" className="text-blush hover:underline">svojas27@gmail.com</a><br />
            <strong className="text-blush-soft">Mailing Address:</strong> Karnataka, KA, 585102, IN
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