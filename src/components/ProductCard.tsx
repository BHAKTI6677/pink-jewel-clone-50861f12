import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useShop, type CartProduct } from "@/context/ShopContext";
import { useFormatPrice } from "@/context/CurrencyContext";

export type CardProduct = {
  id: string;          // slug
  name: string;
  category: string;
  price_inr: number;
  image: string;       // resolved URL
  alt: string;
  tag?: string;
};

export function ProductCard({ product }: { product: CardProduct }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const formatPrice = useFormatPrice();
  const liked = wishlist.includes(product.id);
  const cartItem: CartProduct = {
    id: product.id, name: product.name, image: product.image, alt: product.alt,
    category: product.category, price_inr: product.price_inr,
  };

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-maroon/50 aspect-[4/5]">
        <Link to="/product/$id" params={{ id: product.id }}>
          <img
            src={product.image}
            alt={product.alt}
            loading="lazy"
            width={1024}
            height={1280}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        {product.tag && (
          <span className="absolute left-3 top-3 bg-maroon-deep/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-blush">
            {product.tag}
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Save to wishlist"
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-maroon-deep/80 transition ${
            liked ? "text-blush" : "text-blush/60 hover:text-blush"
          }`}
        >
          <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => addToCart(cartItem)}
          className="absolute inset-x-3 bottom-3 translate-y-3 bg-blush text-maroon-deep py-2.5 text-[11px] uppercase tracking-[0.28em] font-medium opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-blush-soft"
        >
          Quick Add
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.24em] text-blush/60">{product.category}</p>
          <h3 className="mt-0.5 font-display text-lg text-blush-soft truncate">
            <Link to="/product/$id" params={{ id: product.id }} className="hover:text-blush">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="font-display text-base text-blush whitespace-nowrap">{formatPrice(product.price_inr)}</p>
      </div>
      <button
        onClick={() => addToCart(cartItem)}
        className="mt-3 w-full bg-blush/10 hover:bg-blush hover:text-maroon-deep border border-blush/30 py-2.5 text-[11px] uppercase tracking-[0.28em] text-blush transition sm:hidden"
      >
        Add to Bag
      </button>
    </article>
  );
}
