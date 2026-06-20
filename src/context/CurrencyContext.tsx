import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "AUD" | "CAD" | "SGD" | "JPY";

export const SUPPORTED: { code: CurrencyCode; symbol: string; locale: string; flag: string; label: string }[] = [
  { code: "INR", symbol: "₹",   locale: "en-IN", flag: "🇮🇳", label: "Indian Rupee" },
  { code: "USD", symbol: "$",   locale: "en-US", flag: "🇺🇸", label: "US Dollar" },
  { code: "EUR", symbol: "€",   locale: "de-DE", flag: "🇪🇺", label: "Euro" },
  { code: "GBP", symbol: "£",   locale: "en-GB", flag: "🇬🇧", label: "British Pound" },
  { code: "AED", symbol: "د.إ", locale: "en-AE", flag: "🇦🇪", label: "UAE Dirham" },
  { code: "AUD", symbol: "A$",  locale: "en-AU", flag: "🇦🇺", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$",  locale: "en-CA", flag: "🇨🇦", label: "Canadian Dollar" },
  { code: "SGD", symbol: "S$",  locale: "en-SG", flag: "🇸🇬", label: "Singapore Dollar" },
  { code: "JPY", symbol: "¥",   locale: "ja-JP", flag: "🇯🇵", label: "Japanese Yen" },
];

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: "INR", US: "USD", GB: "GBP", AE: "AED", AU: "AUD", CA: "CAD", SG: "SGD", JP: "JPY",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", IE: "EUR", PT: "EUR",
  AT: "EUR", FI: "EUR", GR: "EUR",
};

// Sensible static fallbacks (per 1 INR) used until live rates arrive.
const FALLBACK_RATES: Record<CurrencyCode, number> = {
  INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0094, AED: 0.044,
  AUD: 0.018, CAD: 0.016, SGD: 0.016, JPY: 1.8,
};

const STORAGE_KEY = "svojas:currency";
const RATES_KEY = "svojas:fx-rates";
const RATES_TTL = 60 * 60 * 1000; // 1 hour

type Ctx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  format: (inr: number) => string;
  convert: (inr: number) => number;
  loading: boolean;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [loading, setLoading] = useState(true);

  // Load saved choice or auto-detect via IP on first visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (saved && SUPPORTED.some(s => s.code === saved)) {
      setCurrencyState(saved);
      return;
    }
    fetch("https://ipapi.co/json/")
      .then(r => r.ok ? r.json() : null)
      .then((j: { country_code?: string } | null) => {
        const code = j?.country_code;
        const mapped = code ? COUNTRY_TO_CURRENCY[code] : null;
        if (mapped) {
          setCurrencyState(mapped);
          window.localStorage.setItem(STORAGE_KEY, mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch live FX rates with localStorage cache
  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = window.localStorage.getItem(RATES_KEY);
    if (cached) {
      try {
        const { rates: r, ts } = JSON.parse(cached);
        if (r && ts && Date.now() - ts < RATES_TTL) {
          setRates({ ...FALLBACK_RATES, ...r });
          setLoading(false);
          return;
        }
      } catch {}
    }
    const symbols = SUPPORTED.filter(s => s.code !== "INR").map(s => s.code).join(",");
    fetch(`https://api.exchangerate.host/latest?base=INR&symbols=${symbols}`)
      .then(r => r.ok ? r.json() : null)
      .then((j: { rates?: Record<string, number> } | null) => {
        if (j?.rates) {
          const next = { ...FALLBACK_RATES, ...(j.rates as Record<CurrencyCode, number>), INR: 1 };
          setRates(next);
          window.localStorage.setItem(RATES_KEY, JSON.stringify({ rates: next, ts: Date.now() }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, c);
  };

  const value = useMemo<Ctx>(() => {
    const convert = (inr: number) => inr * (rates[currency] ?? FALLBACK_RATES[currency] ?? 1);
    const format = (inr: number) => {
      const meta = SUPPORTED.find(s => s.code === currency)!;
      const amount = convert(inr);
      const fractionDigits = currency === "INR" || currency === "JPY" ? 0 : 2;
      try {
        return new Intl.NumberFormat(meta.locale, {
          style: "currency",
          currency,
          maximumFractionDigits: fractionDigits,
          minimumFractionDigits: fractionDigits,
        }).format(amount);
      } catch {
        return `${meta.symbol} ${amount.toFixed(fractionDigits)}`;
      }
    };
    return { currency, setCurrency, rates, format, convert, loading };
  }, [currency, rates, loading]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export function useFormatPrice() {
  return useCurrency().format;
}