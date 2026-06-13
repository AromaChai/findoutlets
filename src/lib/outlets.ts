import "server-only";
import { aromaChaiOutlets, type Outlet } from "@/lib/data";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export type OutletRow = {
  id: string;
  slug: string;
  code: string;
  name: string;
  area: string;
  city: string;
  time: string;
  phone: string;
  map: string;
  description: string | null;
  images: string[] | null; // legacy, superseded by cover + gallery
  cover: string | null;
  gallery: string[] | null;
  swiggy: string | null;
  zomato: string | null;
  facebook: string | null;
  instagram: string | null;
  rating: number | null;
  reviews: { name: string; rating: number; text: string }[] | null;
  brands: {
    name: string;
    tagline?: string;
    swiggy?: string;
    zomato?: string;
  }[] | null;
  menu_overrides: Record<string, { off?: boolean; price?: number }> | null;
  sort_order: number;
  active: boolean;
};

function rowToOutlet(row: OutletRow): Outlet {
  return {
    code: row.code,
    slug: row.slug,
    name: row.name,
    area: row.area,
    city: row.city,
    time: row.time,
    phone: Number(row.phone),
    map: row.map,
    description: row.description ?? undefined,
    cover: row.cover ?? row.images?.[0] ?? undefined,
    gallery:
      row.gallery && row.gallery.length > 0 ? row.gallery : undefined,
    swiggy: row.swiggy ?? undefined,
    zomato: row.zomato ?? undefined,
    facebook: row.facebook ?? undefined,
    instagram: row.instagram ?? undefined,
    rating: row.rating ?? undefined,
    reviews: row.reviews && row.reviews.length > 0 ? row.reviews : undefined,
    brands: row.brands && row.brands.length > 0 ? row.brands : undefined,
    menuOverrides: row.menu_overrides ?? undefined,
  };
}

/**
 * Public site reads. Uses Supabase when configured, otherwise falls back to
 * the hardcoded seed list so the site never breaks.
 */
export async function getAllOutlets(): Promise<Outlet[]> {
  if (!isSupabaseConfigured()) return aromaChaiOutlets;

  const { data, error } = await getSupabase()
    .from("outlets")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) return aromaChaiOutlets;
  return (data as OutletRow[]).map(rowToOutlet);
}

export async function getOutlet(slug: string): Promise<Outlet | undefined> {
  if (!isSupabaseConfigured())
    return aromaChaiOutlets.find((o) => o.slug === slug);

  const { data, error } = await getSupabase()
    .from("outlets")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) return aromaChaiOutlets.find((o) => o.slug === slug);
  return rowToOutlet(data as OutletRow);
}

/** Admin reads — includes inactive outlets, returns raw rows. */
export async function getAllOutletRowsForAdmin(): Promise<OutletRow[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await getSupabase()
    .from("outlets")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data as OutletRow[];
}

export async function getOutletRowForAdmin(
  id: string
): Promise<OutletRow | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabase()
    .from("outlets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as OutletRow) ?? null;
}
