"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Navigation,
  ShoppingBag,
  Share2,
  Star,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

import TopNevbar from "@/component/TopNevbar";
import { getOpenInfo } from "@/lib/time";
import {
  menuHighlights,
  getSeoPlace,
  getCityName,
  getCitySlug,
} from "@/lib/data";
import { track } from "@/lib/track";
import type { Outlet, Review } from "@/lib/data";
import type { MenuGroup } from "@/lib/menu";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </span>
  );
}

// "Everyday Value Meal — Burger… (Save ₹99)" → { title, desc, save }
function parseCombo(name: string) {
  const save = name.match(/save\s*₹?\s*(\d+)/i)?.[1];
  const clean = name.replace(/\s*\(save[^)]*\)\s*/i, "").trim();
  const [title, desc] = clean.split("—").map((s) => s.trim());
  return { title, desc, save };
}

function MenuRow({
  name,
  price,
  starred,
}: {
  name: string;
  price: number;
  starred?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2 text-[13px]">
      <span className="text-[#155126]">
        {starred && (
          <Star className="mr-1 inline h-3 w-3 fill-amber-400 text-amber-400" />
        )}
        {name}
      </span>
      <span className="flex-1 border-b border-dotted border-[#d6e8dc]" />
      <span className="font-semibold text-[#155126]">₹{price}</span>
    </div>
  );
}

function ReviewSlider({
  reviews,
  mapUrl,
}: {
  reviews: Review[];
  mapUrl: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const pausedUntil = useRef(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const id = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setIdx((prev) => {
        const next = (prev + 1) % reviews.length;
        const el = trackRef.current;
        const child = el?.children[next] as HTMLElement | undefined;
        if (el && child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [reviews.length]);

  function goTo(i: number) {
    const el = trackRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    setIdx(i);
    pausedUntil.current = Date.now() + 8000;
  }

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="bg-white rounded-xl p-4">
      <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight mb-2">
        What customers say
      </h2>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={() => (pausedUntil.current = Date.now() + 8000)}
        className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
      >
        {reviews.map((review, i) => (
          <div key={i} className="w-full shrink-0 snap-center pr-0.5">
            <div className="h-full rounded-xl bg-[#f3faf5] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-[#0e3a1b]">
                  {review.name}
                </p>
                <Stars rating={review.rating} />
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-[#53735b]">
                “{review.text}”
              </p>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Review ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-4 bg-[#2f9a3f]" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center text-xs font-semibold text-[#2f9a3f]"
      >
        See all reviews on Google →
      </a>
    </div>
  );
}

export default function OutletDetail({
  outlet,
  menu = [],
  offer,
}: {
  outlet: Outlet;
  menu?: MenuGroup[];
  offer?: string;
}) {
  const [, forceUpdate] = useState(0);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  function flashToast() {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  }

  function legacyCopy(text: string): boolean {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  async function handleShare() {
    track("share_click", ctx);
    const url = window.location.href;
    const title = `${outlet.name} — Chai Café in ${getSeoPlace(outlet)}`;

    // 1. Native share sheet (mobile on HTTPS) — gives WhatsApp, etc.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return; // user dismissed the sheet
      }
    }
    // 2. Modern clipboard (desktop on HTTPS / localhost)
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        flashToast();
        return;
      } catch {
        /* fall through */
      }
    }
    // 3. Legacy copy — works even on insecure http (phone on local network)
    if (legacyCopy(url)) {
      flashToast();
      return;
    }
    // 4. Last resort — open a WhatsApp share
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      "_blank"
    );
  }

  // re-check open status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const status = getOpenInfo(outlet.time);
  const open = status.open;

  // attached to every event so you can slice tracking by outlet / city
  const ctx = { outlet: outlet.slug, city: getCitySlug(outlet) };
  const hasOrderLinks = Boolean(outlet.swiggy || outlet.zomato);
  const hasCover = Boolean(outlet.cover);

  // menu spotlight: combos + top 3 best sellers up front, the rest behind "See more"
  const combosGroup = menu.find((g) => /combo/i.test(g.category));
  const bestsellers = menu
    .flatMap((g) => g.items.filter((i) => i.bestseller))
    .slice(0, 3);
  const restGroups = menu.filter((g) => g !== combosGroup);
  const restItemCount = restGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1B4D3E] to-[#2C7A63]">
      {/* Top Navbar */}
      <div className="fixed z-30 left-0 right-0 px-2 bg-linear-to-b from-[#1B4D3E] to-transparent">
        <TopNevbar />
      </div>

      {/* Scrollable content */}
      <div className="fixed top-16 bottom-20 left-0 right-0 z-10 overflow-y-auto no-scrollbar px-3 md:px-4">
        <div className="mx-auto max-w-md space-y-4 pt-4 pb-6">
          {/* Cover photo banner — blends into the page background */}
          {hasCover ? (
            <div className="-mx-3 -mt-4 md:-mx-4">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={outlet.cover!}
                  alt={`${outlet.name} – shopfront`}
                  fill
                  priority
                  className="object-cover"
                />
                {/* fade the photo into the green background */}
                <div className="absolute inset-0 bg-linear-to-b from-[#1B4D3E]/45 via-transparent to-[#1d5345]" />
                <Link
                  href={`/${getCitySlug(outlet)}`}
                  className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {getCityName(outlet)} outlets
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href={`/${getCitySlug(outlet)}`}
              className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              {getCityName(outlet)} outlets
            </Link>
          )}

          {/* Hero card — frosted glass over the photo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            style={hasCover ? { marginTop: "-5rem" } : undefined}
            className={`relative z-10 rounded-xl p-4 ${
              hasCover
                ? "bg-white/80 shadow-xl ring-1 ring-white/50 backdrop-blur-md"
                : "bg-white"
            }`}
          >
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this outlet"
              className="absolute right-3 top-3 rounded-full bg-[#f3faf5] p-2 text-[#155126] active:scale-90 transition-transform"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-4 pr-8">
              <div className="w-14 h-14 shrink-0 rounded-full bg-[#2f9a3f] text-white flex items-center justify-center font-semibold text-base">
                {outlet.code}
              </div>
              <div className="flex-1">
                <h1 className="text-[20px] font-bold text-[#0e3a1b] leading-tight tracking-tight">
                  {outlet.name}
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#2f9a3f] mt-1">
                    Chai Café in {getSeoPlace(outlet)}
                  </span>
                </h1>
                <p className="text-[12px] text-[#6b8474] mt-1">
                  {outlet.area} · {outlet.city}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  open
                    ? "bg-[#e6f4ea] text-[#155126]"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                ● {status.label}
              </span>
              <span className="bg-[#24483d] text-white text-[10px] rounded-full px-2.5 py-1">
                {outlet.time}
              </span>
              {outlet.rating && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#155126]">
                  <Stars rating={outlet.rating} /> {outlet.rating.toFixed(1)}
                </span>
              )}
            </div>
          </motion.div>

          {/* Offer banner */}
          {offer && (
            <div className="rounded-xl bg-amber-400 px-3 py-2.5 text-center text-xs font-bold text-[#3d2c00] shadow-sm">
              🎉 {offer}
            </div>
          )}

          {/* About */}
          {outlet.description && (
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight mb-1.5">
                About this outlet
              </h2>
              <p className="text-[13px] leading-relaxed text-[#53735b]">
                {outlet.description}
              </p>
            </div>
          )}

          {/* Gallery — swipe through outlet photos */}
          {outlet.gallery && outlet.gallery.length > 0 && (
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight mb-2">
                Gallery
              </h2>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar snap-x snap-mandatory">
                {outlet.gallery.map((src, i) => (
                  <div
                    key={i}
                    className="relative h-44 w-[72%] shrink-0 snap-center overflow-hidden rounded-xl"
                  >
                    <Image
                      src={src}
                      alt={`${outlet.name} gallery photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-[10px] text-[#53735b]">
                Swipe to see more →
              </p>
            </div>
          )}

          {/* Menu — combos & best sellers up front, rest behind See more */}
          {menu.length > 0 && (
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight">
                Menu
              </h2>

              {/* Combo deals */}
              {combosGroup && (
                <div className="mt-2 space-y-2">
                  {combosGroup.items.map((item) => {
                    const combo = parseCombo(item.name);
                    return (
                      <div
                        key={item.id}
                        className="relative overflow-hidden rounded-xl bg-linear-to-br from-[#155126] to-[#2C7A63] p-3 text-white"
                      >
                        {combo.save && (
                          <span className="absolute right-0 top-0 rounded-bl-xl bg-amber-400 px-2.5 py-1 text-[10px] font-extrabold text-[#3d2c00]">
                            SAVE ₹{combo.save}
                          </span>
                        )}
                        <p className="pr-20 text-[13px] font-bold">
                          {combo.title}
                        </p>
                        {combo.desc && (
                          <p className="mt-0.5 pr-2 text-[10px] leading-snug text-white/75">
                            {combo.desc}
                          </p>
                        )}
                        <p className="mt-1.5 text-[15px] font-extrabold">
                          ₹{item.price}
                          <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wide text-amber-300">
                            Best Deal
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Best sellers */}
              {bestsellers.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-[#2f9a3f]">
                    ⭐ Best Sellers
                  </h3>
                  <div className="mt-1.5 space-y-1.5">
                    {bestsellers.map((item) => (
                      <MenuRow
                        key={item.id}
                        name={item.name}
                        price={item.price}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Full menu behind See more */}
              {restGroups.length > 0 && (
                <>
                  <AnimatePresence initial={false}>
                    {menuExpanded && (
                      <motion.div
                        key="more-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-4">
                          {restGroups.map((group) => (
                            <div key={group.category}>
                              <h3 className="text-xs font-bold uppercase tracking-wide text-[#2f9a3f]">
                                {group.category}
                              </h3>
                              <div className="mt-1.5 space-y-1.5">
                                {group.items.map((item) => (
                                  <MenuRow
                                    key={item.id}
                                    name={item.name}
                                    price={item.price}
                                    starred={item.bestseller}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => {
                      if (!menuExpanded) track("menu_expand", ctx);
                      setMenuExpanded(!menuExpanded);
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-[#d6e8dc] bg-[#f3faf5] py-2.5 text-xs font-semibold text-[#155126]"
                  >
                    {menuExpanded ? (
                      <>
                        See less <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        See full menu ({restItemCount} items){" "}
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Menu highlights */}
          <div className="bg-white rounded-xl p-4">
            <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight mb-2">
              Menu highlights
            </h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 snap-x">
              {menuHighlights.map((item) => (
                <div key={item.name} className="w-28 shrink-0 snap-start">
                  <div className="relative h-28 w-28 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] font-medium text-[#155126] leading-tight">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews — auto-advancing swipeable slider */}
          {outlet.reviews && outlet.reviews.length > 0 && (
            <ReviewSlider reviews={outlet.reviews} mapUrl={outlet.map} />
          )}

          {/* Franchise CTA — every happy visitor is a potential franchisee */}
          <a
            href="https://franchise.aromachai.in"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("franchise_click", { ...ctx, source: "outlet_cta" })}
            className="block rounded-xl bg-linear-to-br from-[#155126] to-[#2C7A63] p-4 text-white active:scale-[0.99] transition-transform"
          >
            <p className="text-[15px] font-bold">Love this place? Own one. 🍵</p>
            <p className="mt-1 text-[12px] leading-snug text-white/80">
              Start your own Aroma Chai franchise from ₹8 lakhs.
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-[#3d2c00]">
              Get franchise details →
            </span>
          </a>

          {/* Our online brands */}
          {outlet.brands && outlet.brands.length > 0 && (
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight mb-1">
                Also from this outlet
              </h2>
              <p className="text-[11px] text-[#53735b] mb-3">
                Our online brands, prepared fresh in the same kitchen.
              </p>
              <div className="space-y-3">
                {outlet.brands.map((brand) => (
                  <div
                    key={brand.name}
                    className="rounded-xl border border-[#e3efe7] p-3"
                  >
                    <p className="text-[13px] font-semibold text-[#155126]">
                      {brand.name}
                    </p>
                    {brand.tagline && (
                      <p className="text-[11px] text-[#53735b]">
                        {brand.tagline}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2">
                      {brand.swiggy && (
                        <a
                          href={brand.swiggy}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            track("brand_click", {
                              ...ctx,
                              brand: brand.name,
                              platform: "swiggy",
                            })
                          }
                          className="flex-1 rounded-lg bg-[#fc8019] py-1.5 text-center text-xs font-semibold text-white"
                        >
                          Swiggy
                        </a>
                      )}
                      {brand.zomato && (
                        <a
                          href={brand.zomato}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            track("brand_click", {
                              ...ctx,
                              brand: brand.name,
                              platform: "zomato",
                            })
                          }
                          className="flex-1 rounded-lg bg-[#e23744] py-1.5 text-center text-xs font-semibold text-white"
                        >
                          Zomato
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-xl p-4 space-y-3">
            <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight">
              Outlet details
            </h2>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#2f9a3f]" />
              <div>
                <p className="text-[13px] font-semibold text-[#0e3a1b]">Address</p>
                <a
                  href={outlet.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("directions_click", { ...ctx, source: "address" })
                  }
                  className="text-xs text-[#2f9a3f] underline underline-offset-2"
                >
                  {outlet.area}, {outlet.city}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-0.5 shrink-0 text-[#2f9a3f]" />
              <div>
                <p className="text-[13px] font-semibold text-[#0e3a1b]">Timings</p>
                <p className="text-xs text-[#53735b]">
                  {outlet.time} · All days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5 shrink-0 text-[#2f9a3f]" />
              <div>
                <p className="text-[13px] font-semibold text-[#0e3a1b]">Phone</p>
                <a
                  href={`tel:${outlet.phone}`}
                  onClick={() => track("call_click", { ...ctx, source: "details" })}
                  className="text-xs text-[#2f9a3f] font-medium"
                >
                  +91 {outlet.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Social */}
          {(outlet.instagram || outlet.facebook) && (
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight mb-2">
                Follow this outlet
              </h2>
              <div className="flex gap-2">
                {outlet.instagram && (
                  <a
                    href={outlet.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("social_click", { ...ctx, platform: "instagram" })
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f3faf5] py-2.5 text-xs font-semibold text-[#155126]"
                  >
                    <FaInstagram className="h-4 w-4" /> Instagram
                  </a>
                )}
                {outlet.facebook && (
                  <a
                    href={outlet.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("social_click", { ...ctx, platform: "facebook" })
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f3faf5] py-2.5 text-xs font-semibold text-[#155126]"
                  >
                    <FaFacebook className="h-4 w-4" /> Facebook
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share confirmation toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#0e3a1b] px-4 py-2 text-xs font-semibold text-white shadow-lg"
          >
            Link copied ✓
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Now bottom sheet */}
      <AnimatePresence>
        {orderSheetOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderSheetOpen(false)}
              className="fixed inset-0 z-40 bg-black/50"
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white p-4 pb-6"
            >
              <div className="mx-auto max-w-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-[#0e3a1b] tracking-tight">
                    Order from {outlet.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setOrderSheetOpen(false)}
                    className="rounded-full bg-gray-100 p-1.5 text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-[#53735b]">
                  Choose your delivery app
                </p>
                <div className="mt-3 space-y-2">
                  {outlet.swiggy && (
                    <a
                      href={outlet.swiggy}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        track("order_click", { ...ctx, platform: "swiggy" });
                        setOrderSheetOpen(false);
                      }}
                      className="flex w-full items-center justify-center rounded-xl bg-[#fc8019] py-3.5 text-sm font-bold text-white active:scale-95 transition-transform"
                    >
                      Order on Swiggy
                    </a>
                  )}
                  {outlet.zomato && (
                    <a
                      href={outlet.zomato}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        track("order_click", { ...ctx, platform: "zomato" });
                        setOrderSheetOpen(false);
                      }}
                      className="flex w-full items-center justify-center rounded-xl bg-[#e23744] py-3.5 text-sm font-bold text-white active:scale-95 transition-transform"
                    >
                      Order on Zomato
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white p-2 pb-3">
        <div className="mx-auto flex w-full max-w-md items-center gap-2">
          <a
            href={`tel:${outlet.phone}`}
            onClick={() => track("call_click", { ...ctx, source: "sticky" })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#155126] py-3 text-[13px] font-semibold text-white active:scale-95 transition-transform"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <a
            href={outlet.map}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("directions_click", { ...ctx, source: "sticky" })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#2f9a3f] py-3 text-[13px] font-semibold text-white active:scale-95 transition-transform"
          >
            <Navigation className="h-4 w-4" />
            Directions
          </a>
          {hasOrderLinks && (
            <button
              type="button"
              onClick={() => {
                track("order_now_open", ctx);
                setOrderSheetOpen(true);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#fc8019] py-3 text-[13px] font-semibold text-white active:scale-95 transition-transform"
            >
              <ShoppingBag className="h-4 w-4" />
              Order Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
