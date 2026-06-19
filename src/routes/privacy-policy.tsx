import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SVOJAS.CO" },
      { name: "description", content: "How SVOJAS.CO collects, uses and safeguards your personal information." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
      <p className="eyebrow">Policies</p>
      <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-xs uppercase tracking-[0.24em] text-blush/60">Last Updated: June 19, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-blush/80">
        <p>
          At SVOJAS.CO, we are committed to safeguarding your personal data. This policy details how
          we gather, utilize, and secure your information when you visit our website, shop with us,
          use our features, or get in touch with our team.
        </p>
        <p>
          By interacting with our platform, you acknowledge the data practices outlined below. If any
          part of this policy clashes with our Terms of Service, this document takes priority
          regarding data handling.
        </p>

        <Section title="1. Information We Gather">
          <p>
            We collect data that identifies you or can be reasonably linked to you. We do not include
            completely anonymized or aggregated data that can no longer pinpoint your identity.
          </p>
          <p>Depending on how you use our site, we may process the following types of information:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">Contact &amp; Identity Details:</strong> Your full name, email address, physical shipping address, billing address, and phone number.</li>
            <li><strong className="text-blush-soft">Payment &amp; Financial Data:</strong> Billing details, payment card numbers, transaction confirmations, and preferred payment methods.</li>
            <li><strong className="text-blush-soft">Account Credentials:</strong> Usernames, encrypted passwords, security answers, and account preferences.</li>
            <li><strong className="text-blush-soft">Purchase History &amp; Activity:</strong> Items you browse, products left in your shopping cart, wishlist selections, completed purchases, returns, or order cancellations.</li>
            <li><strong className="text-blush-soft">Customer Support Records:</strong> Any text or context you provide when reaching out to us for help.</li>
            <li><strong className="text-blush-soft">Technical &amp; Device Data:</strong> Your IP address, browser type, network connection information, operating system, and unique device identifiers.</li>
            <li><strong className="text-blush-soft">Browsing Analytics:</strong> Data on how you navigate our site, including page timestamps, click patterns, and site interaction speeds.</li>
          </ul>
        </Section>

        <Section title="2. How We Source Your Data">
          <p>We collect your information through four primary channels:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">Directly From You:</strong> When you register an account, check out, fill out forms, or email our support desk.</li>
            <li><strong className="text-blush-soft">Automated Technologies:</strong> As you browse, our servers automatically log technical information via cookies, web beacons, and similar tracking tools.</li>
            <li><strong className="text-blush-soft">Service Partners:</strong> From entities that assist us with web hosting, database management, and operational logistics.</li>
            <li><strong className="text-blush-soft">Third-Party Alliances:</strong> From marketing networks or public platforms that share relevant consumer insights.</li>
          </ul>
        </Section>

        <Section title="3. How Your Information is Used">
          <p>We process your personal details to achieve specific business goals, including:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">Order Fulfillment &amp; Personalization:</strong> To process payments, ship orders, manage returns, track your account preferences, and suggest products tailored to your tastes.</li>
            <li><strong className="text-blush-soft">Marketing &amp; Promotions:</strong> To send you promotional newsletters, text alerts, or direct mail, and to display targeted digital advertisements on other sites based on your browsing patterns.</li>
            <li><strong className="text-blush-soft">Security &amp; Fraud Mitigation:</strong> To verify user identities, protect against malicious or illegal activity, secure our digital infrastructure, and maintain a safe shopping environment.</li>
            <li><strong className="text-blush-soft">Customer Relations:</strong> To respond to your direct inquiries, resolve troubleshooting bugs, and manage our business relationship with you.</li>
            <li><strong className="text-blush-soft">Legal Compliance:</strong> To satisfy local laws, comply with court orders or law enforcement requests, and defend our legal rights in court proceedings.</li>
          </ul>
        </Section>

        <Section title="4. When and Why We Share Data">
          <p>We do not sell your data for cash. However, we do disclose information to trusted partners to keep our store running smoothly:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">Operational Vendors:</strong> We share data with third parties who handle our cloud storage, payment processing, data analytics, and shipping logistics.</li>
            <li><strong className="text-blush-soft">Marketing Partners:</strong> We work with advertising networks to show you tailored ads across the internet. You can restrict this data sharing depending on your regional laws.</li>
            <li><strong className="text-blush-soft">Corporate Shifts:</strong> If we undergo a merger, asset sale, or restructuring, your data may be transferred to the acquiring business entity.</li>
            <li><strong className="text-blush-soft">Legal Mandates:</strong> We will disclose data if required by law, such as responding to a subpoena or protecting the safety of our users.</li>
          </ul>
        </Section>

        <Section title="5. Third-Party Connections">
          <p>
            Our website may feature links to external websites that we do not own or manage. Once you
            click away from SVOJAS.CO, our privacy policy no longer applies. We highly recommend
            reviewing the privacy statements of any third-party sites you visit, as we cannot take
            responsibility for their independent data handling or security standards.
          </p>
        </Section>

        <Section title="6. Protection of Minors">
          <p>
            Our website is designed entirely for adult consumers. We do not intentionally gather data
            from anyone under the age of majority in their respective jurisdiction. If you are a
            parent or legal guardian and realize your minor child has provided us with their details,
            please reach out to us using the contact information below so we can scrub it from our
            system.
          </p>
        </Section>

        <Section title="7. Security Safeguards & Data Retention">
          <p>
            While we employ industry-standard security practices to shield your data, please remember
            that no transmission over the internet is completely flawless or impenetrable.
          </p>
          <p>
            We keep your data stored only for as long as necessary to fulfill your orders, resolve
            billing disputes, protect our legal standing, or comply with statutory tax and financial
            record-keeping laws.
          </p>
        </Section>

        <Section title="8. Your Regional Rights & Privacy Choices">
          <p>
            Depending on where you live (such as the EU, UK, or certain US states), you may hold
            specific legal rights regarding your personal profile. These typically include the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-blush-soft">Access/Know:</strong> Request a summary or copy of the personal information we hold about you.</li>
            <li><strong className="text-blush-soft">Delete:</strong> Request that we permanently erase your personal files.</li>
            <li><strong className="text-blush-soft">Correct:</strong> Ask us to update or fix inaccurate or incomplete records.</li>
            <li><strong className="text-blush-soft">Opt-Out of Targeted Ads:</strong> Object to your data being used for personalized digital advertising.</li>
            <li><strong className="text-blush-soft">Manage Email Preferences:</strong> You can click the "unsubscribe" link at the bottom of any of our promotional emails to stop receiving marketing messages. We will still send transaction-related updates regarding your orders.</li>
            <li><strong className="text-blush-soft">Global Privacy Control (GPC):</strong> If your web browser transmits a GPC opt-out signal, our system is configured to respect that setting automatically by restricting targeted advertising trackers on that browser.</li>
          </ul>
          <p>
            If you are a resident of the UK or European Economic Area (EEA), you also have the right
            to object to or restrict certain data processing styles, withdraw consent at any time, or
            lodge an official complaint with your local Data Protection Authority.
          </p>
        </Section>

        <Section title="9. Global Data Transfers">
          <p>
            Because we operate globally, your information may be routed, stored, or processed outside
            of your home country. For users in the UK or EEA, when we move your data out of those
            regions, we deploy recognized safety mechanisms — such as the European Commission's
            Standard Contractual Clauses (SCCs) — to guarantee your data receives equivalent legal
            protection.
          </p>
        </Section>

        <Section title="10. Policy Updates">
          <p>
            We update this Privacy Policy periodically to match changes in our business or evolving
            privacy laws. When updates occur, we will adjust the "Last Updated" date at the top of
            this page. We encourage you to review this page regularly to stay informed.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            If you have any questions about these privacy standards, want to lodge a complaint, or
            wish to exercise your legal data rights, please contact our team:
          </p>
          <p>
            <strong className="text-blush-soft">Email:</strong>{" "}
            <a href="mailto:pearlitadcosta2@gmail.com" className="text-blush hover:underline">pearlitadcosta2@gmail.com</a>
            <br />
            <strong className="text-blush-soft">Mailing Address:</strong> Malad West, Mumbai, MH, 400095, IN
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