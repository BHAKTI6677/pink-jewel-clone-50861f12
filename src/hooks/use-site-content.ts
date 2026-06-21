import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/hooks/use-products";

export type Slide = {
  id: string;
  image_url: string;
  alt_text: string;
  headline: string;
  subtext: string;
  link_url: string;
  sort: number;
  active: boolean;
};

export type SiteCategory = {
  id: string;
  slug: string;
  label: string;
  image_url: string;
  sort: number;
  active: boolean;
};

export function useSlides(adminAll = false) {
  return useQuery({
    queryKey: ["home_slides", adminAll ? "all" : "active"],
    queryFn: async (): Promise<Slide[]> => {
      let q = supabase.from("home_slides").select("*").order("sort", { ascending: true });
      if (!adminAll) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Slide[];
    },
  });
}

export function useSiteCategories(adminAll = false) {
  return useQuery({
    queryKey: ["site_categories", adminAll ? "all" : "active"],
    queryFn: async (): Promise<SiteCategory[]> => {
      let q = supabase.from("site_categories").select("*").order("sort", { ascending: true });
      if (!adminAll) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as SiteCategory[];
    },
  });
}

export { resolveImage };