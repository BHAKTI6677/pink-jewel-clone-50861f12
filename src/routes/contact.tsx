import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Instagram } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SVOJAS.CO" },
      { name: "description", content: "Reach the SVOJAS.CO atelier for orders, custom commissions and care." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <header className="max-w-xl">
        <p className="eyebrow">Get in Touch</p>
        <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">We'd love to hear from you</h1>
        <p className="mt-4 text-sm text-blush/70">For reviews, issues or queries — write to us.</p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={e => { e.preventDefault(); setSent(true); }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required />
            <Field label="Email" type="email" required />
          </div>
          <Field label="Subject" />
          <label className="block">
            <span className="block text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">Message</span>
            <textarea
              required
              rows={6}
              className="w-full bg-maroon-deep/60 border border-blush/30 px-4 py-3 text-sm text-blush-soft placeholder:text-blush/40 focus:border-blush focus:outline-none resize-none"
            />
          </label>
          <button className="btn-primary">Send Message</button>
          {sent && <p className="text-xs text-gold">Thank you. We'll reply within 24 hours.</p>}
        </form>

        <aside className="space-y-6 lg:border-l lg:border-border/40 lg:pl-10">
          <Detail icon={<MapPin className="h-4 w-4" />} title="Atelier">
            1-889/13, Old Jewargi Road<br />585102 — Karnataka<br />India
          </Detail>
          <Detail icon={<Mail className="h-4 w-4" />} title="Email">
            <a href="mailto:svojas27@gmail.com" className="hover:text-blush">svojas27@gmail.com</a>
          </Detail>
          <Detail icon={<Phone className="h-4 w-4" />} title="Phone">
            +91 8431680311
          </Detail>
          <Detail icon={<Instagram className="h-4 w-4" />} title="Follow">
            <a href="https://instagram.com" className="hover:text-blush">@svojas.co</a>
          </Detail>
        </aside>
      </div>

      {/* Mini FAQ */}
      <section className="mt-20 border-t border-border/40 pt-12">
        <p className="eyebrow">Frequently Asked</p>
        <h2 className="mt-3 font-display text-3xl text-blush-soft">Quick answers</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Faq q="How can I track my order?" a='Once your order ships, you will receive a confirmation email containing a tracking link. You can also log into your SVOJAS.CO account at any time to view your real-time shipment status under "My Orders."' />
          <Faq q="How long will it take for my order to arrive?" a="Standard domestic orders typically ship within 24–48 hours and arrive within 6–8 business days. International shipping generally takes 10–14 business days. If you need your piece sooner, expedited shipping options are available at checkout." />
          <Faq q="How should I clean and store my SVOJAS jewellery?" a="To keep your pieces looking pristine, gently wipe them with a soft, microfiber cloth after wearing. Store them in a cool, dry place — ideally inside the cloth pouch or a lined jewellery box to prevent scratching and minimize exposure to moisture." />
        </div>
      </section>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">{label}</span>
      <input {...props} className="w-full bg-maroon-deep/60 border border-blush/30 px-4 py-2.5 text-sm text-blush-soft focus:border-blush focus:outline-none" />
    </label>
  );
}

function Detail({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-blush">
        {icon}
        <p className="text-[10px] uppercase tracking-[0.28em]">{title}</p>
      </div>
      <div className="mt-2 text-sm text-blush/80 leading-relaxed">{children}</div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-t border-border/40 pt-5">
      <p className="font-display text-lg text-blush-soft">{q}</p>
      <p className="mt-2 text-sm text-blush/70 leading-relaxed">{a}</p>
    </div>
  );
}
