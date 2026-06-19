import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/contact", label: "Contact" },
  { to: "/auth", label: "Login / Register" },
] as const;

export function Nav() {
  const { count, wishlist, setDrawerOpen } = useShop();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-maroon-deep/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 lg:px-10">
        {/* Left: Brand */}
        <Link to="/" className="font-display text-xl tracking-[0.32em] text-blush sm:text-2xl sm:tracking-[0.4em]">
          SVOJAS<span className="text-gold">.</span>CO
        </Link>

        {/* Center: nothing on mobile, links on desktop */}
        <nav className="hidden lg:flex items-center justify-center gap-9 text-[11px] uppercase tracking-[0.28em] text-blush/80">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-blush" }}
              className="hover:text-blush transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-3 sm:gap-5 text-blush/80">
          <button
            aria-label="Search"
            onClick={() => setSearch(s => !s)}
            className="hover:text-blush transition hidden sm:inline-flex"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link to="/shop" aria-label="Wishlist" className="hover:text-blush transition relative">
            <Heart className="h-[18px] w-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-maroon-deep">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Cart"
            className="hover:text-blush transition relative"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-maroon-deep">
                {count}
              </span>
            )}
          </button>
          <button
            className="lg:hidden hover:text-blush transition"
            onClick={() => setMobile(m => !m)}
            aria-label="Menu"
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {search && (
        <div className="border-t border-border/60 bg-maroon-deep px-5 py-3 lg:px-10">
          <div className="mx-auto flex max-w-3xl items-center gap-3 border border-blush/30 px-3">
            <Search className="h-4 w-4 text-blush/60" />
            <input
              autoFocus
              type="search"
              placeholder="Search jewellery, collections..."
              className="flex-1 bg-transparent py-2 text-sm text-blush-soft placeholder:text-blush/40 focus:outline-none"
            />
            <button onClick={() => setSearch(false)} className="text-blush/60 hover:text-blush">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {mobile && (
        <div className="lg:hidden border-t border-border/60 bg-maroon-deep px-6 py-5 flex flex-col gap-4 text-sm uppercase tracking-[0.28em] text-blush/90">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobile(false)} className="hover:text-blush">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
