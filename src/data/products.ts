import necklaceImg from "@/assets/product-necklace.jpg";
import earringsImg from "@/assets/product-earrings.jpg";
import banglesImg from "@/assets/product-bangles.jpg";
import ringImg from "@/assets/product-ring.jpg";
import braceletImg from "@/assets/product-bracelet.jpg";
import desiDivaImg from "@/assets/product-desidiva.jpg";
import heroImg from "@/assets/hero-jewellery.jpg";

export type Product = {
  id: string;
  name: string;
  category: "Necklaces" | "Earrings" | "Bracelets" | "Rings" | "Desi Divas";
  price: number;
  img: string;
  alt: string;
  tag: "New" | "Bestseller" | "Heritage" | "Limited" | "Sale";
  bestseller?: boolean;
  description: string;
  materials: string;
  care: string;
  shipping: string;
};

export const productsRaw: Product[] = [
  {
    id: "rohini-pendant",
    name: "Rohini Pendant",
    category: "Necklaces",
    price: 48500,
    img: necklaceImg,
    alt: "Rohini gold pendant with rose quartz",
    tag: "New",
    bestseller: true,
    description: "A single uncut rose quartz, set in 22-karat gold, suspended on a hand-hammered chain. Designed to be layered or worn alone.",
    materials: "22k yellow gold · Uncut rose quartz · 18\" adjustable chain · Total weight 11.4 g.",
    care: "Store in the velvet pouch provided. Polish gently with a soft cotton cloth. Complimentary re-polish for life.",
    shipping: "Free insured shipping across India in 4–6 days. International 7–10 days. Easy 14-day returns.",
  },
  {
    id: "gulaab-drops",
    name: "Gulaab Drops",
    category: "Earrings",
    price: 36200,
    img: earringsImg,
    alt: "Gulaab gold drop earrings with rubies",
    tag: "Bestseller",
    bestseller: true,
    description: "Pear-cut Burmese rubies cradled in milgrain gold petals — light enough for everyday, sharp enough for evening.",
    materials: "22k gold · Burmese ruby (1.2 ct total) · Screw backs · Weight 6.8 g per pair.",
    care: "Avoid contact with perfume and chlorinated water. Polish with included cloth.",
    shipping: "Free insured shipping in India in 4–6 days. 14-day returns.",
  },
  {
    id: "sindoori-bangles",
    name: "Sindoori Bangles",
    category: "Bracelets",
    price: 62000,
    img: banglesImg,
    alt: "Sindoori stacked gold bangles",
    tag: "Heritage",
    description: "A pair of slim, hand-hammered bangles finished in our signature warm sindoori gold. Sold as a set of two.",
    materials: "22k gold · 2.4 mm width · Pair total weight 24 g.",
    care: "Bangles soften with wear — re-polish annually with our complimentary care service.",
    shipping: "Free insured shipping in India in 4–6 days.",
  },
  {
    id: "maharani-ring",
    name: "Maharani Ring",
    category: "Rings",
    price: 84900,
    img: ringImg,
    alt: "Maharani statement gold ring",
    tag: "Limited",
    bestseller: true,
    description: "A solitaire rose quartz haloed in pavé rubies — our most-requested statement ring, limited to 24 pieces a year.",
    materials: "22k gold · 4 ct rose quartz · 0.3 ct ruby pavé · Sizes US 4–9.",
    care: "Remove before sleep and exercise. Annual complimentary re-rhodium.",
    shipping: "Free insured shipping. Sizing & engraving included.",
  },
  {
    id: "mogra-choker",
    name: "Mogra Choker",
    category: "Necklaces",
    price: 72000,
    img: desiDivaImg,
    alt: "Mogra ceremonial gold choker",
    tag: "New",
    description: "A ceremonial choker of clustered gold mogra blossoms with ruby centres. Worn high, on the throat.",
    materials: "22k gold · Rubies & freshwater pearls · 14\" + 2\" extender.",
    care: "Hand-clean only. Store flat in the box provided.",
    shipping: "Free insured shipping in India in 5–7 days.",
  },
  {
    id: "panna-studs",
    name: "Panna Studs",
    category: "Earrings",
    price: 28900,
    img: earringsImg,
    alt: "Panna gold stud earrings",
    tag: "Sale",
    description: "Small, perfect, every-day. Bezel-set rose quartz studs in brushed 22k gold.",
    materials: "22k gold · Rose quartz (0.8 ct each) · Push backs.",
    care: "Wipe with soft cloth after each wear.",
    shipping: "Free insured shipping in India in 4–6 days.",
  },
  {
    id: "kundan-kada",
    name: "Kundan Kada",
    category: "Bracelets",
    price: 55500,
    img: braceletImg,
    alt: "Kundan kada bracelet with rose quartz",
    tag: "Heritage",
    description: "A single solitaire rose quartz set in traditional kundan, on a slim hinged gold cuff.",
    materials: "22k gold · Rose quartz solitaire · Hinged opening with safety clasp.",
    care: "Avoid water and impact. Re-set complimentary for life.",
    shipping: "Free insured shipping in India.",
  },
  {
    id: "surya-band",
    name: "Surya Band",
    category: "Rings",
    price: 41000,
    img: ringImg,
    alt: "Surya band ring in gold",
    tag: "Bestseller",
    bestseller: true,
    description: "A sunray-engraved band — quiet enough to stack, distinct enough to stand alone.",
    materials: "22k gold · 4 mm width · Sizes US 4–10.",
    care: "Polish with included cloth.",
    shipping: "Free insured shipping in India.",
  },
];

export const categories = [
  { slug: "Necklaces", label: "Necklaces", img: necklaceImg },
  { slug: "Earrings", label: "Earrings", img: earringsImg },
  { slug: "Bracelets", label: "Bracelets", img: braceletImg },
  { slug: "Rings", label: "Rings", img: ringImg },
  { slug: "Desi Divas", label: "Desi Divas", img: desiDivaImg },
] as const;

export const heroImage = heroImg;

export const formatPrice = (n: number) =>
  "₹ " + n.toLocaleString("en-IN");

export const getProduct = (id: string) => productsRaw.find(p => p.id === id);

// Adapter to the new CardProduct/CartProduct shape used everywhere.
export type CardLikeProduct = {
  id: string;
  name: string;
  category: string;
  price_inr: number;
  image: string;
  alt: string;
  tag?: string;
  bestseller?: boolean;
  description: string;
  materials: string;
  care: string;
  shipping: string;
};

export const toCard = (p: Product): CardLikeProduct => ({
  id: p.id, name: p.name, category: p.category, price_inr: p.price,
  image: p.img, alt: p.alt, tag: p.tag, bestseller: p.bestseller,
  description: p.description, materials: p.materials, care: p.care, shipping: p.shipping,
});

export const products: CardLikeProduct[] = productsRaw.map(toCard);
