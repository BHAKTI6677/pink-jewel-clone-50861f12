import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useCurrency, SUPPORTED } from "@/context/CurrencyContext";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = SUPPORTED.find(s => s.code === currency)!;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Change currency"
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-blush/80 hover:text-blush transition"
      >
        <span aria-hidden>{active.flag}</span>
        <span>{active.code}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-[200px] border border-blush/30 bg-maroon-deep shadow-xl">
          <ul className="py-1 max-h-72 overflow-y-auto">
            {SUPPORTED.map(s => (
              <li key={s.code}>
                <button
                  onClick={() => { setCurrency(s.code); setOpen(false); }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-xs transition hover:bg-blush/10 ${
                    s.code === currency ? "text-blush" : "text-blush/80"
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden>{s.flag}</span>
                  <span className="flex-1">
                    <span className="block uppercase tracking-[0.18em]">{s.code}</span>
                    <span className="block text-[10px] text-blush/50 normal-case">{s.label}</span>
                  </span>
                  {s.code === currency && <Check className="h-3.5 w-3.5" />}
                </button>
              </li>
            ))}
          </ul>
          <p className="border-t border-blush/15 px-3 py-2 text-[9px] uppercase tracking-[0.22em] text-blush/40">
            Display only · Checkout in INR
          </p>
        </div>
      )}
    </div>
  );
}