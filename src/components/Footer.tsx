import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-maroon-deep text-blush-soft border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-2xl tracking-[0.4em]">SVOJAS<span className="text-gold">.</span>CO</p>
            <div className="mt-5 flex items-center gap-3">
              <a href="https://instagram.com" aria-label="Instagram" className="grid h-9 w-9 place-items-center border border-blush/30 hover:border-blush hover:text-blush transition">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-blush/50">Customer Service</p>
            <ul className="mt-3 space-y-2 text-sm text-blush/90">
              <li><Link to="/contact" className="hover:text-blush">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-blush">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-blush">Order Tracking</Link></li>
              <li><Link to="/contact" className="hover:text-blush">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-blush/50">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-blush/90">
              <li><a href="#" className="hover:text-blush">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blush">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blush">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-blush">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-blush/50">Join the Inner Circle</p>
            <p className="mt-3 text-sm text-blush/70">
              First look at new pieces. One letter a month.
            </p>
            <form onSubmit={e => e.preventDefault()} className="mt-3 flex border border-blush/30">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-blush-soft placeholder:text-blush/40 focus:outline-none"
              />
              <button className="bg-blush px-4 text-[11px] uppercase tracking-[0.22em] text-maroon-deep hover:bg-blush-soft transition">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-blush/15 pt-5 text-xs text-blush/60 md:flex-row md:items-center">
          <p>© 2025 SVOJAS.CO — Founded by BHAKTI BANDAK.</p>
        </div>
      </div>
    </footer>
  );
}
