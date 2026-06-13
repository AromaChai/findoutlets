"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { login, logout, isLoggedIn } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { parseTime } from "@/lib/time";

export type ActionResult = { ok: boolean; message: string };

/* ---------------- AUTH ---------------- */

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "");
  const ok = await login(password);
  if (!ok) {
    return {
      ok: false,
      message: process.env.ADMIN_PASSWORD
        ? "Wrong password. Try again."
        : "ADMIN_PASSWORD is not set up yet. Add it in Vercel → Settings → Environment Variables.",
    };
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/login");
}

/* ---------------- OUTLET CRUD ---------------- */

export type OutletPayload = {
  id?: string;
  slug: string;
  code: string;
  name: string;
  area: string;
  city: string;
  time: string;
  phone: string;
  map: string;
  description: string;
  cover: string;
  gallery: string[];
  swiggy: string;
  zomato: string;
  facebook: string;
  instagram: string;
  rating: string;
  reviews: { name: string; rating: number; text: string }[];
  brands: { name: string; tagline?: string; swiggy?: string; zomato?: string }[];
  menu_overrides: Record<string, { off?: boolean; price?: number }>;
  sort_order: number;
  active: boolean;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/aroma\s*chai/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin(): Promise<string | null> {
  if (!(await isLoggedIn())) return "Not logged in. Refresh and log in again.";
  if (!isSupabaseConfigured())
    return "Supabase is not connected yet. Add the Supabase keys in environment variables.";
  return null;
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/[city]", "page");
  revalidatePath("/[city]/[slug]", "page");
}

export async function saveOutlet(payload: OutletPayload): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return { ok: false, message: guard };

  // basic validation
  if (!payload.name.trim()) return { ok: false, message: "Name is required." };
  if (!payload.area.trim()) return { ok: false, message: "Area is required." };
  if (!payload.city.trim()) return { ok: false, message: "City is required." };
  if (!payload.map.trim())
    return { ok: false, message: "Google Maps link is required." };
  if (!/^\d{10}$/.test(payload.phone.trim()))
    return { ok: false, message: "Phone must be a 10-digit number." };
  if (!parseTime(payload.time))
    return {
      ok: false,
      message:
        'Timings must look like "7:30 AM - 11:00 PM" (with AM/PM on both sides).',
    };

  const slug = payload.slug.trim() || slugify(payload.name);
  if (!/^[a-z0-9-]+$/.test(slug))
    return {
      ok: false,
      message: "Slug can only have small letters, numbers and dashes.",
    };

  const row = {
    slug,
    code: payload.code.trim().toUpperCase().slice(0, 3) ||
      payload.name.replace(/aroma\s*chai/i, "").trim().slice(0, 3).toUpperCase(),
    name: payload.name.trim(),
    area: payload.area.trim(),
    city: payload.city.trim(),
    time: payload.time.trim(),
    phone: payload.phone.trim(),
    map: payload.map.trim(),
    description: payload.description.trim() || null,
    cover: payload.cover.trim() || null,
    gallery: payload.gallery,
    swiggy: payload.swiggy.trim() || null,
    zomato: payload.zomato.trim() || null,
    facebook: payload.facebook.trim() || null,
    instagram: payload.instagram.trim() || null,
    rating: payload.rating.trim() ? Number(payload.rating) : null,
    reviews: payload.reviews.filter((r) => r.name.trim() && r.text.trim()),
    brands: payload.brands.filter((b) => b.name.trim()),
    menu_overrides: Object.fromEntries(
      Object.entries(payload.menu_overrides ?? {}).filter(
        ([, o]) => o.off === true || typeof o.price === "number"
      )
    ),
    sort_order: payload.sort_order,
    active: payload.active,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();

  if (payload.id) {
    const { error } = await supabase
      .from("outlets")
      .update(row)
      .eq("id", payload.id);
    if (error) return { ok: false, message: `Could not save: ${error.message}` };
  } else {
    const { error } = await supabase.from("outlets").insert(row);
    if (error) {
      if (error.code === "23505")
        return {
          ok: false,
          message: `An outlet with the slug "${slug}" already exists. Change the slug.`,
        };
      return { ok: false, message: `Could not create: ${error.message}` };
    }
  }

  revalidateSite();
  const citySlug = payload.city
    .split(/[–—-]/)[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return {
    ok: true,
    message: payload.id
      ? "Saved! The live page updates within a few minutes."
      : `Outlet created! Its page is live at /${citySlug}/${slug}.`,
  };
}

export async function deleteOutlet(
  id: string,
  slug: string
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return { ok: false, message: guard };

  const { error } = await getSupabase().from("outlets").delete().eq("id", id);
  if (error) return { ok: false, message: `Could not delete: ${error.message}` };

  revalidateSite();
  return { ok: true, message: "Outlet deleted." };
}

/* ---------------- MASTER MENU ---------------- */

export async function saveMasterMenu(
  items: {
    id: string;
    category: string;
    name: string;
    price: number | null;
    bestseller?: boolean;
  }[]
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return { ok: false, message: guard };

  const cleaned = items
    .filter((i) => i.name.trim() && i.category.trim())
    .map((i) => ({
      id: i.id,
      category: i.category.trim(),
      name: i.name.trim(),
      price:
        typeof i.price === "number" && !Number.isNaN(i.price) && i.price >= 0
          ? i.price
          : null,
      bestseller: i.bestseller === true,
    }));

  const { error } = await getSupabase()
    .from("settings")
    .upsert(
      { key: "menu", value: cleaned, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  if (error)
    return { ok: false, message: `Could not save menu: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/[city]", "page");
  revalidatePath("/[city]/[slug]", "page");
  return {
    ok: true,
    message: `Menu saved (${cleaned.length} items). Outlet pages update within a few minutes.`,
  };
}

/* ---------------- OFFER BANNER ---------------- */

export async function saveOffer(text: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return { ok: false, message: guard };

  const { error } = await getSupabase()
    .from("settings")
    .upsert(
      {
        key: "offer",
        value: { text: text.trim() },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  if (error)
    return { ok: false, message: `Could not save offer: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/[city]", "page");
  revalidatePath("/[city]/[slug]", "page");
  return {
    ok: true,
    message: text.trim()
      ? "Offer banner is on. It appears on all pages within a few minutes."
      : "Offer banner removed.",
  };
}

/* ---------------- IMAGE UPLOAD ---------------- */

export async function uploadImage(
  formData: FormData
): Promise<{ ok: boolean; url?: string; message: string }> {
  const guard = await requireAdmin();
  if (guard) return { ok: false, message: guard };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0)
    return { ok: false, message: "No file selected." };
  if (file.size > 5 * 1024 * 1024)
    return { ok: false, message: "Image must be under 5 MB." };
  if (!file.type.startsWith("image/"))
    return { ok: false, message: "Only image files are allowed." };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `outlets/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from("outlet-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { ok: false, message: `Upload failed: ${error.message}` };

  const { data } = supabase.storage.from("outlet-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl, message: "Uploaded." };
}
