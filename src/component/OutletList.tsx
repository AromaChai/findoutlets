"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin, ChevronLeft } from "lucide-react";
import { motion, easeInOut } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import TopNevbar from "./TopNevbar";
import Header from "./Header";
import { isOpen, getOpenInfo } from "@/lib/time";
import { getCityName, getCitySlug } from "@/lib/data";
import { track } from "@/lib/track";
import type { Outlet } from "@/lib/data";

export default function OutletList({
  outlets,
  offer,
  heading = "Aroma Chai Outlets",
  subheading = "Chai cafés near you — timings, menu, directions & online ordering",
  showBackLink = false,
  showCityFilter = false,
}: {
  outlets: Outlet[];
  offer?: string;
  heading?: string;
  subheading?: string;
  showBackLink?: boolean;
  showCityFilter?: boolean;
}) {
  const router = useRouter();
  const [, forceUpdate] = useState(0);
  const [cityFilter, setCityFilter] = useState<string>("all");

  // re-check every minute
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // unique cities, in the order outlets appear (new cities show up automatically)
  const cities = outlets.reduce<{ slug: string; name: string }[]>(
    (acc, outlet) => {
      const slug = getCitySlug(outlet);
      if (!acc.some((c) => c.slug === slug))
        acc.push({ slug, name: getCityName(outlet) });
      return acc;
    },
    []
  );

  const filteredOutlets =
    cityFilter === "all"
      ? outlets
      : outlets.filter((o) => getCitySlug(o) === cityFilter);

  const sortedOutlets = [...filteredOutlets].sort((a, b) => {
    const aOpen = isOpen(a.time);
    const bOpen = isOpen(b.time);
    return aOpen === bOpen ? 0 : aOpen ? -1 : 1;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.25,
        ease: easeInOut,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1B4D3E] to-[#2C7A63]">
      {/* Top Navbar */}
      <div className="fixed z-30 left-0 right-0 px-2">
        <TopNevbar />
      </div>

      {/* Outlet List */}
      <div className="fixed top-16 bottom-16 left-0 right-0 z-10
        overflow-y-auto px-1 md:px-4 space-y-3 no-scrollbar ">

        {showBackLink && (
          <Link
            href="/"
            className="mx-1 mt-2 inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            All outlets
          </Link>
        )}

        {offer && (
          <div className="mx-1 mt-2 rounded-xl bg-amber-400 px-3 py-2.5 text-center text-xs font-bold text-[#3d2c00] shadow-sm">
            🎉 {offer}
          </div>
        )}

        <h1 className="px-2 pt-2 text-sm font-semibold text-white/90">
          {heading}
          <span className="block text-[11px] font-normal text-white/60 mt-0.5">
            {subheading}
          </span>
        </h1>

        {/* City filter chips */}
        {showCityFilter && cities.length > 1 && (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-2 no-scrollbar">
            <button
              type="button"
              onClick={() => setCityFilter("all")}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                cityFilter === "all"
                  ? "bg-white text-[#155126]"
                  : "bg-white/15 text-white"
              }`}
            >
              All cities
            </button>
            {cities.map((city) => (
              <button
                key={city.slug}
                type="button"
                onClick={() => {
                  track("city_filter", { city: city.slug });
                  setCityFilter(city.slug);
                }}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  cityFilter === city.slug
                    ? "bg-white text-[#155126]"
                    : "bg-white/15 text-white"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        )}

        {sortedOutlets.map((outlet, idx) => {
          const open = isOpen(outlet.time);

          return (
            <motion.div
              key={`${outlet.code}-${idx}`}
              custom={idx}
              initial="hidden"
              animate="show"
              variants={cardVariants}
              whileHover={open ? { scale: 1.01 } : {}}
              onClick={() => {
                track("outlet_select", {
                  outlet: outlet.slug,
                  city: getCitySlug(outlet),
                });
                router.push(`/${getCitySlug(outlet)}/${outlet.slug}`);
              }}
              className={`relative my-6 cursor-pointer transition-opacity
                ${open ? "opacity-100" : "opacity-40"}
              `}
            >

              {/* Time badge */}
              <div className="absolute -top-3.5 left-9 z-20">
                <div className="bg-[#24483d] text-white text-[8px]
                  rounded-full px-2 py-1 shadow-sm">
                  {outlet.time}
                </div>
              </div>

              {/* Card */}
              <div className="bg-white p-1 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full
                  bg-[#2f9a3f] text-white flex items-center justify-center
                  font-semibold text-sm sm:text-base">
                  {outlet.code}
                </div>

                <div className="flex-1">
                  <p className="text-[13px] sm:text-[15px] font-semibold text-[#155126]">
                    {outlet.name}
                  </p>
                  <p className="text-xs text-[#53735b]">
                    {outlet.area} · {outlet.city}
                  </p>
                </div>

                {/* Actions */}
                <div
                  className={`flex items-center rounded-full overflow-hidden
                    ${open ? "bg-[#2f9a3f]" : "bg-gray-400 pointer-events-none"}
                  `}
                >
                  <Link
                    href={outlet.map}
                    target="_blank"
                    onClick={(e) => {
                      e.stopPropagation();
                      track("directions_click", {
                        outlet: outlet.slug,
                        city: getCitySlug(outlet),
                        source: "list",
                      });
                    }}
                    className={`flex items-center gap-1 px-3 py-2
                      text-xs font-medium text-white
                      ${open ? "bg-[#2f9a3f]" : "bg-gray-400 pointer-events-none"}
                      `}
                  >
                    <MapPin className="h-4 w-4" />
                    Map
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      track("call_click", {
                        outlet: outlet.slug,
                        city: getCitySlug(outlet),
                        source: "list",
                      });
                      window.open(`tel:${outlet.phone}`, "_self");
                    }}
                    className={`h-9 w-9 flex items-center justify-center
                      bg-[#016313] text-white
                      ${open ? "bg-[#2f9a3f]" : "bg-gray-400 pointer-events-none"}
                      `}
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Closed Overlay — shows when it next opens */}
              {!open && (
                <div className="absolute inset-0 rounded-xl
                  bg-black/30 z-20 flex items-center justify-center">
                  <span className="text-white text-[11px] bg-[#155126] px-2.5 py-1 rounded-md font-semibold">
                    {getOpenInfo(outlet.time).label}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white p-1">
        <Header />
      </div>
    </div>
  );
}
