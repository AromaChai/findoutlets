"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Upload, Loader2 } from "lucide-react";

import {
  saveOutlet,
  deleteOutlet,
  uploadImage,
  type OutletPayload,
} from "@/app/admin/actions";
import type { OutletRow } from "@/lib/outlets";
import type { MenuItem, MenuOverrides } from "@/lib/menu";

type ReviewDraft = { name: string; rating: number; text: string };
type BrandDraft = {
  name: string;
  tagline?: string;
  swiggy?: string;
  zomato?: string;
};

const inputCls =
  "w-full rounded-xl border border-[#d6e8dc] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2f9a3f]";
const labelCls = "block text-xs font-semibold text-[#155126] mb-1 mt-3";
const sectionCls = "rounded-2xl bg-white p-4 shadow-sm";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/aroma\s*chai/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function OutletForm({
  row,
  masterMenu,
}: {
  row: OutletRow | null;
  masterMenu: MenuItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null
  );
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(row?.name ?? "Aroma Chai – ");
  const [slug, setSlug] = useState(row?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(row));
  const [code, setCode] = useState(row?.code ?? "");
  const [area, setArea] = useState(row?.area ?? "");
  const [city, setCity] = useState(row?.city ?? "");
  const [time, setTime] = useState(row?.time ?? "9:00 AM - 10:00 PM");
  const [phone, setPhone] = useState(row?.phone ?? "");
  const [map, setMap] = useState(row?.map ?? "");
  const [description, setDescription] = useState(row?.description ?? "");
  const [cover, setCover] = useState<string>(
    row?.cover ?? row?.images?.[0] ?? ""
  );
  const [gallery, setGallery] = useState<string[]>(
    row?.gallery ?? row?.images?.slice(1) ?? []
  );
  const [swiggy, setSwiggy] = useState(row?.swiggy ?? "");
  const [zomato, setZomato] = useState(row?.zomato ?? "");
  const [facebook, setFacebook] = useState(row?.facebook ?? "");
  const [instagram, setInstagram] = useState(row?.instagram ?? "");
  const [rating, setRating] = useState(row?.rating ? String(row.rating) : "");
  const [reviews, setReviews] = useState<ReviewDraft[]>(row?.reviews ?? []);
  const [brands, setBrands] = useState<BrandDraft[]>(row?.brands ?? []);
  const [sortOrder, setSortOrder] = useState(row?.sort_order ?? 100);
  const [active, setActive] = useState(row?.active ?? true);
  const [menuOverrides, setMenuOverrides] = useState<MenuOverrides>(
    row?.menu_overrides ?? {}
  );

  const menuCategories = [...new Set(masterMenu.map((i) => i.category))];

  function setOverride(
    id: string,
    patch: { off?: boolean; price?: number | undefined }
  ) {
    setMenuOverrides((prev) => {
      const current = { ...(prev[id] ?? {}), ...patch };
      if (patch.off === false) delete current.off;
      if (patch.price === undefined) delete current.price;
      const next = { ...prev };
      if (Object.keys(current).length === 0) delete next[id];
      else next[id] = current;
      return next;
    });
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
    if (!row && !code) {
      // suggest a 3-letter code from the locality
      const locality = value.replace(/aroma\s*chai/i, "").replace(/[–-]/g, "").trim();
      if (locality.length >= 3) setCode(locality.slice(0, 3).toUpperCase());
    }
  }

  // Shrink large phone photos in the browser before upload (max 1600px, JPEG)
  async function compressImage(file: File): Promise<File> {
    try {
      const bitmap = await createImageBitmap(file);
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      if (scale === 1 && file.size < 500 * 1024) return file; // already small
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.85)
      );
      if (!blob) return file;
      return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
        type: "image/jpeg",
      });
    } catch {
      return file; // if compression fails, upload the original
    }
  }

  async function handleUpload(
    files: FileList | null,
    target: "cover" | "gallery"
  ) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage(null);
    try {
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file);
        if (compressed.size > 9 * 1024 * 1024) {
          setMessage({
            ok: false,
            text: `"${file.name}" is too large even after compression. Try a smaller photo.`,
          });
          continue;
        }
        const fd = new FormData();
        fd.append("file", compressed);
        const res = await uploadImage(fd);
        if (res.ok && res.url) {
          if (target === "cover") {
            setCover(res.url);
            break; // cover is a single photo
          }
          setGallery((prev) => [...prev, res.url!]);
        } else {
          setMessage({ ok: false, text: res.message });
        }
      }
    } catch (err) {
      setMessage({
        ok: false,
        text: `Upload failed: ${err instanceof Error ? err.message : "unknown error"}. Try a smaller photo.`,
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleSave() {
    setMessage(null);
    const payload: OutletPayload = {
      id: row?.id,
      slug,
      code,
      name,
      area,
      city,
      time,
      phone,
      map,
      description,
      cover,
      gallery,
      swiggy,
      zomato,
      facebook,
      instagram,
      rating,
      reviews,
      brands,
      menu_overrides: menuOverrides,
      sort_order: sortOrder,
      active,
    };
    startTransition(async () => {
      const res = await saveOutlet(payload);
      setMessage({ ok: res.ok, text: res.message });
      if (res.ok && !row) router.push("/admin");
    });
  }

  function handleDelete() {
    if (!row) return;
    if (
      !window.confirm(
        `Delete "${row.name}" permanently? Its page will be removed from the site.`
      )
    )
      return;
    startTransition(async () => {
      const res = await deleteOutlet(row.id, row.slug);
      if (res.ok) router.push("/admin");
      else setMessage({ ok: false, text: res.message });
    });
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Basic info */}
      <div className={sectionCls}>
        <h2 className="text-sm font-semibold">Basic details</h2>

        <label className={labelCls}>Outlet name</label>
        <input
          className={inputCls}
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Aroma Chai – Vashi"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Page link (slug)</label>
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="vashi"
            />
            <p className="mt-1 text-[10px] text-[#53735b]">
              Page will be findus.aromachai.in/{slug || "…"}
            </p>
          </div>
          <div>
            <label className={labelCls}>Badge code (3 letters)</label>
            <input
              className={inputCls}
              value={code}
              maxLength={3}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VAS"
            />
          </div>
        </div>

        <label className={labelCls}>Area (street / sector)</label>
        <input
          className={inputCls}
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Sector 17, Vashi"
        />

        <label className={labelCls}>City line (with pincode)</label>
        <input
          className={inputCls}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Navi Mumbai – 400703"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Timings</label>
            <input
              className={inputCls}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="9:00 AM - 10:00 PM"
            />
          </div>
          <div>
            <label className={labelCls}>Phone (10 digits)</label>
            <input
              className={inputCls}
              value={phone}
              inputMode="numeric"
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
            />
          </div>
        </div>

        <label className={labelCls}>Google Maps link</label>
        <input
          className={inputCls}
          value={map}
          onChange={(e) => setMap(e.target.value)}
          placeholder="https://maps.app.goo.gl/…"
        />

        <label className={labelCls}>
          About this outlet (local SEO description)
        </label>
        <textarea
          className={`${inputCls} min-h-28`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Chai café in …, open daily …. Mention the area name, nearby landmarks, what you serve and timings."
        />
        <p className="mt-1 text-[10px] text-[#53735b]">
          Tip: 70–90 words. Mention the locality 2–3 times naturally, nearby
          landmarks, menu items and timings.
        </p>
      </div>

      {/* Cover photo */}
      <div className={sectionCls}>
        <h2 className="text-sm font-semibold">Cover photo (banner)</h2>
        <p className="mt-1 text-[10px] text-[#53735b]">
          One landscape (horizontal) photo — shows as the big banner at the
          top of the outlet page. Best: the shopfront.
        </p>
        <div className="mt-3">
          {cover ? (
            <div className="relative">
              <div className="relative h-36 w-full overflow-hidden rounded-xl">
                <Image src={cover} alt="Cover" fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setCover("")}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-red-600 p-1 text-white"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#d6e8dc] text-[#53735b]">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span className="text-[10px] font-medium">
                    Upload cover photo
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleUpload(e.target.files, "cover")}
              />
            </label>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className={sectionCls}>
        <h2 className="text-sm font-semibold">Gallery photos</h2>
        <p className="mt-1 text-[10px] text-[#53735b]">
          Add as many as you like — visitors swipe through these on the outlet
          page. Good set: counter, seating, chai being served, food.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {gallery.map((src, i) => (
            <div key={src} className="relative">
              <div className="relative h-24 w-full overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`Gallery photo ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setGallery(gallery.filter((u) => u !== src))}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-red-600 p-1 text-white"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#d6e8dc] text-[#53735b]">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-[10px] font-medium">Add photos</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleUpload(e.target.files, "gallery")}
            />
          </label>
        </div>
      </div>

      {/* Links */}
      <div className={sectionCls}>
        <h2 className="text-sm font-semibold">Order & social links</h2>

        <label className={labelCls}>Swiggy link (this outlet)</label>
        <input className={inputCls} value={swiggy} onChange={(e) => setSwiggy(e.target.value)} placeholder="https://www.swiggy.com/restaurants/…" />

        <label className={labelCls}>Zomato link (this outlet)</label>
        <input className={inputCls} value={zomato} onChange={(e) => setZomato(e.target.value)} placeholder="https://www.zomato.com/…" />

        <label className={labelCls}>Instagram link</label>
        <input className={inputCls} value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://www.instagram.com/…" />

        <label className={labelCls}>Facebook link</label>
        <input className={inputCls} value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://www.facebook.com/…" />
      </div>

      {/* Rating & reviews */}
      <div className={sectionCls}>
        <h2 className="text-sm font-semibold">Google rating & reviews</h2>

        <label className={labelCls}>Google rating (e.g. 4.6)</label>
        <input
          className={inputCls}
          value={rating}
          inputMode="decimal"
          onChange={(e) => setRating(e.target.value.replace(/[^\d.]/g, ""))}
          placeholder="4.6"
        />

        {reviews.map((review, i) => (
          <div key={i} className="mt-3 rounded-xl border border-[#e3efe7] p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">Review {i + 1}</p>
              <button
                type="button"
                onClick={() => setReviews(reviews.filter((_, j) => j !== i))}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <input
                className={`${inputCls} col-span-2`}
                value={review.name}
                onChange={(e) =>
                  setReviews(reviews.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))
                }
                placeholder="Reviewer name"
              />
              <select
                className={inputCls}
                value={review.rating}
                onChange={(e) =>
                  setReviews(reviews.map((r, j) => (j === i ? { ...r, rating: Number(e.target.value) } : r)))
                }
              >
                {[5, 4, 3].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className={`${inputCls} mt-2 min-h-16`}
              value={review.text}
              onChange={(e) =>
                setReviews(reviews.map((r, j) => (j === i ? { ...r, text: e.target.value } : r)))
              }
              placeholder="Copy the exact review text from Google Maps"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setReviews([...reviews, { name: "", rating: 5, text: "" }])}
          className="mt-3 inline-flex items-center gap-1 rounded-xl border border-[#d6e8dc] px-3 py-2 text-xs font-semibold text-[#155126]"
        >
          <Plus className="h-4 w-4" /> Add review
        </button>
      </div>

      {/* Brands */}
      <div className={sectionCls}>
        <h2 className="text-sm font-semibold">
          Online brands at this outlet (BreadHub, My Fries…)
        </h2>

        {brands.map((brand, i) => (
          <div key={i} className="mt-3 rounded-xl border border-[#e3efe7] p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">Brand {i + 1}</p>
              <button
                type="button"
                onClick={() => setBrands(brands.filter((_, j) => j !== i))}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <input
              className={`${inputCls} mt-2`}
              value={brand.name}
              onChange={(e) =>
                setBrands(brands.map((b, j) => (j === i ? { ...b, name: e.target.value } : b)))
              }
              placeholder="Brand name (e.g. BreadHub)"
            />
            <input
              className={`${inputCls} mt-2`}
              value={brand.tagline ?? ""}
              onChange={(e) =>
                setBrands(brands.map((b, j) => (j === i ? { ...b, tagline: e.target.value } : b)))
              }
              placeholder="One line (e.g. Fresh breads & sandwiches — online only)"
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                className={inputCls}
                value={brand.swiggy ?? ""}
                onChange={(e) =>
                  setBrands(brands.map((b, j) => (j === i ? { ...b, swiggy: e.target.value } : b)))
                }
                placeholder="Swiggy link"
              />
              <input
                className={inputCls}
                value={brand.zomato ?? ""}
                onChange={(e) =>
                  setBrands(brands.map((b, j) => (j === i ? { ...b, zomato: e.target.value } : b)))
                }
                placeholder="Zomato link"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setBrands([...brands, { name: "" }])}
          className="mt-3 inline-flex items-center gap-1 rounded-xl border border-[#d6e8dc] px-3 py-2 text-xs font-semibold text-[#155126]"
        >
          <Plus className="h-4 w-4" /> Add brand
        </button>
      </div>

      {/* Menu at this outlet */}
      {masterMenu.length > 0 && (
        <div className={sectionCls}>
          <h2 className="text-sm font-semibold">Menu at this outlet</h2>
          <p className="mt-1 text-[10px] text-[#53735b]">
            Untick items this outlet doesn&apos;t serve. Type a price only if
            it differs from the standard price. Manage the full menu from the
            main Menu page.
          </p>
          {menuCategories.map((category) => (
            <div key={category} className="mt-3">
              <p className="text-xs font-semibold text-[#53735b]">{category}</p>
              <div className="mt-1 space-y-1.5">
                {masterMenu
                  .filter((i) => i.category === category)
                  .map((item) => {
                    const ov = menuOverrides[item.id] ?? {};
                    const available = !ov.off;
                    return (
                      <div key={item.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={available}
                          onChange={(e) =>
                            setOverride(item.id, { off: !e.target.checked })
                          }
                          className="h-4 w-4 shrink-0 accent-[#2f9a3f]"
                        />
                        <span
                          className={`min-w-0 flex-1 truncate text-[13px] ${
                            available ? "text-[#155126]" : "text-gray-400 line-through"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#53735b]">
                          {item.price !== null ? `₹${item.price}` : "no price"}
                        </span>
                        <input
                          className="w-16 rounded-lg border border-[#d6e8dc] px-2 py-1 text-xs outline-none focus:border-[#2f9a3f] disabled:bg-gray-100"
                          inputMode="numeric"
                          disabled={!available}
                          value={ov.price ?? ""}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^\d]/g, "");
                            setOverride(item.id, {
                              price: v === "" ? undefined : Number(v),
                            });
                          }}
                          placeholder="₹ here"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      <div className={sectionCls}>
        <h2 className="text-sm font-semibold">Visibility</h2>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold">Show on website</p>
            <p className="text-[10px] text-[#53735b]">
              Turn off to hide this outlet without deleting it
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActive(!active)}
            className={`h-7 w-12 rounded-full p-1 transition-colors ${
              active ? "bg-[#2f9a3f]" : "bg-gray-300"
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                active ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        <label className={labelCls}>Sort position (lower = higher)</label>
        <input
          className={inputCls}
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </div>

      {/* Save bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#e3efe7] bg-white p-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          {row && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 disabled:opacity-60"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={pending || uploading}
            className="flex-1 rounded-xl bg-[#155126] py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : row ? "Save changes" : "Create outlet"}
          </button>
        </div>
        {message && (
          <p
            className={`mx-auto mt-2 max-w-2xl text-xs font-medium ${
              message.ok ? "text-[#2f9a3f]" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
