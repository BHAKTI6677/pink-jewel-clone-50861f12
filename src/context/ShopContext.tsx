import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { products as ALL, type Product } from "@/data/products";

export type CartItem = { product: Product; qty: number };

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleWishlist: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
};

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addToCart = (id: string, qty = 1) => {
    const product = ALL.find(p => p.id === id);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(c => c.product.id === id);
      if (existing) {
        return prev.map(c => c.product.id === id ? { ...c, qty: c.qty + qty } : c);
      }
      return [...prev, { product, qty }];
    });
    setDrawerOpen(true);
  };

  const removeFromCart = (id: string) =>
    setCart(prev => prev.filter(c => c.product.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(c => c.product.id === id ? { ...c, qty } : c));
  };

  const toggleWishlist = (id: string) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const clearCart = () => setCart([]);

  const subtotal = useMemo(
    () => cart.reduce((s, c) => s + c.product.price * c.qty, 0),
    [cart],
  );
  const count = useMemo(
    () => cart.reduce((s, c) => s + c.qty, 0),
    [cart],
  );

  return (
    <ShopContext.Provider value={{
      cart, wishlist, drawerOpen, setDrawerOpen,
      addToCart, removeFromCart, updateQty, toggleWishlist, clearCart,
      subtotal, count,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
