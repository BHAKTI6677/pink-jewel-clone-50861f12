import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useFormatPrice } from "@/context/CurrencyContext";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, cart, updateQty, removeFromCart, subtotal, count } = useShop();
  const formatPrice = useFormatPrice();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />
      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-maroon-deep border-l border-border/60 shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div>
            <p className="eyebrow">Your Bag</p>
            <p className="mt-1 font-display text-xl text-blush-soft">
              {count} {count === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close" className="text-blush/80 hover:text-blush">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-2xl text-blush-soft">Your bag is empty</p>
              <p className="mt-2 text-sm text-blush/60">Discover pieces made to be inherited.</p>
              <Link to="/shop" onClick={() => setDrawerOpen(false)} className="btn-primary mt-6">
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {cart.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-4">
                  <Link
                    to="/product/$id"
                    params={{ id: product.id }}
                    onClick={() => setDrawerOpen(false)}
                    className="block h-24 w-20 shrink-0 overflow-hidden bg-maroon/40"
                  >
                    <img src={product.image} alt={product.alt} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-blush/60">{product.category}</p>
                        <p className="font-display text-base text-blush-soft truncate">{product.name}</p>
                      </div>
                      <p className="font-display text-sm text-blush whitespace-nowrap">{formatPrice(product.price_inr * qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center border border-blush/30">
                        <button onClick={() => updateQty(product.id, qty - 1)} className="p-1.5 text-blush/80 hover:text-blush" aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs text-blush-soft">{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)} className="p-1.5 text-blush/80 hover:text-blush" aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(product.id)} className="text-blush/60 hover:text-blush" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="border-t border-border/60 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between text-sm text-blush/80">
              <span className="uppercase tracking-[0.22em] text-[11px]">Subtotal</span>
              <span className="font-display text-lg text-blush-soft">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] text-blush/60">Shipping & taxes calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/cart" onClick={() => setDrawerOpen(false)} className="btn-outline">View Bag</Link>
              <Link to="/checkout" onClick={() => setDrawerOpen(false)} className="btn-primary">Checkout</Link>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
