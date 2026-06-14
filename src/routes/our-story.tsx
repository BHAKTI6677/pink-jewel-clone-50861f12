import { createFileRoute } from "@tanstack/react-router";
import atelierImg from "@/assets/atelier.jpg";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — SVOJAS.CO" },
      { name: "description", content: "The story of SVOJAS.CO, founded in 2019 in Jaipur by Bhakti Bandak." },
      { property: "og:title", content: "Our Story — SVOJAS.CO" },
      { property: "og:image", content: atelierImg },
    ],
  }),
  component: OurStory,
});

function OurStory() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <header className="max-w-2xl">
          <p className="eyebrow">Our Story</p>
          <h1 className="mt-3 font-display text-4xl text-blush-soft sm:text-5xl">
            Crafted by obsession, <em className="text-blush">inspired by love.</em>
          </h1>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <img src={atelierImg} alt="The SVOJAS.CO atelier in Jaipur" className="w-full aspect-[4/5] object-cover" />
          </div>
          <div className="lg:col-span-6 space-y-5 text-sm leading-relaxed text-blush/80">
            <p>
              SVOJAS.CO was founded in 2019 by <span className="text-blush font-medium">Bhakti Bandak</span>,
              on a kitchen table in Jaipur, with a single ruby pendant and a promise — to make
              jewellery the slow way, the right way, without a single shortcut.
            </p>
            <p>
              Today, our atelier is home to forty-two women goldsmiths. Each one trained for
              at least three years before touching a customer piece. Each one signs the inside
              of the clasp of the work she finishes.
            </p>
            <p>
              We work in 22-karat gold, Burmese rubies and uncut rose quartz. We refuse
              synthetics, refuse mass-production, and refuse the trend cycle. We design
              instead for the drawer your daughter will open in thirty years.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-maroon/30">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:py-20">
          <p className="eyebrow">A Note From The Founder</p>
          <blockquote className="mt-6 font-display text-2xl leading-snug text-blush-soft sm:text-3xl md:text-4xl">
            <span className="text-gold">"</span>
            We do not design for the trend cycle. We design for the
            drawer your daughter will one day open, find a velvet box,
            and feel found.
            <span className="text-gold">"</span>
          </blockquote>
          <p className="mt-6 text-sm uppercase tracking-[0.32em] text-blush/80">— Bhakti Bandak, Founder</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-border/40 pt-10">
          <Stat n="2019" l="Founded" />
          <Stat n="42" l="Artisans" />
          <Stat n="~ 900" l="Pieces / year" />
          <Stat n="22k" l="Gold purity" />
        </div>
      </section>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="font-display text-4xl text-blush">{n}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-blush/60">{l}</p>
    </div>
  );
}
