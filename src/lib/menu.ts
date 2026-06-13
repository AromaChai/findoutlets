import "server-only";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export type MenuItem = {
  id: string;
  category: string;
  name: string;
  price: number | null; // null = price not set yet; item hidden on the site
  bestseller?: boolean; // shown in the "Best Sellers" spotlight on outlet pages
};

export type MenuOverride = {
  off?: boolean; // outlet doesn't serve this item
  price?: number; // outlet-specific price
};

export type MenuOverrides = Record<string, MenuOverride>;

export type MenuGroup = {
  category: string;
  items: { id: string; name: string; price: number; bestseller?: boolean }[];
};

/** The brand-wide master menu, managed in /admin/menu. */
export async function getMasterMenu(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabase()
    .from("settings")
    .select("value")
    .eq("key", "menu")
    .maybeSingle();
  if (error || !data?.value) return [];
  return data.value as MenuItem[];
}

/** Brand-wide offer banner text. Empty string = no banner shown. */
export async function getOffer(): Promise<string> {
  if (!isSupabaseConfigured()) return "";
  const { data, error } = await getSupabase()
    .from("settings")
    .select("value")
    .eq("key", "offer")
    .maybeSingle();
  if (error || !data?.value) return "";
  return ((data.value as { text?: string }).text ?? "").trim();
}

/**
 * The menu one outlet actually shows: master items minus the ones switched
 * off for this outlet, with outlet-specific prices applied. Items without
 * any price are hidden. Grouped by category in master-menu order.
 */
export function computeOutletMenu(
  master: MenuItem[],
  overrides: MenuOverrides | null | undefined
): MenuGroup[] {
  const groups: MenuGroup[] = [];
  for (const item of master) {
    const override = overrides?.[item.id];
    if (override?.off) continue;
    const price = override?.price ?? item.price;
    if (price === null || price === undefined) continue;

    let group = groups.find((g) => g.category === item.category);
    if (!group) {
      group = { category: item.category, items: [] };
      groups.push(group);
    }
    group.items.push({
      id: item.id,
      name: item.name,
      price,
      bestseller: item.bestseller,
    });
  }
  return groups;
}
