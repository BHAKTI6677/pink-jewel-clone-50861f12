import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  materials: string;
  care: string;
  shipping: string;
  price_inr: number;
  image_url: string;
  alt_text: string;
  tag: string;
  bestseller: boolean;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export function useProducts(opts: { adminAll?: boolean } = {}) {
  return useQuery({
    queryKey: ["products", opts.adminAll ? "all" : "active"],
    queryFn: async (): Promise<DbProduct[]> => {
      let q = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (!opts.adminAll) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as DbProduct[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async (): Promise<DbProduct | null> => {
      const { data, error } = await supabase
        .from("products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return (data as DbProduct | null);
    },
    enabled: !!slug,
  });
}

/** Resolve a product image_url to a viewable URL (handles storage paths). */
export function resolveImage(url: string): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:")) return url;
  // Storage object path -> signed URL via getPublicUrl (bucket is private but we use signed URLs from admin upload)
  const { data } = supabase.storage.from("product-images").getPublicUrl(url);
  return data.publicUrl;
}