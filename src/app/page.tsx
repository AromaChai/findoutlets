"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { motion, easeInOut } from "framer-motion";
import Link from "next/link";

import TopNevbar from "../component/TopNevbar";
import Header from "../component/Header";
import { aromaChaiOutlets } from "@/lib/data";

/* ---------------- TIME UTILS ---------------- */

function parseTime(
  timeStr: string
): {
  openHour: number;
  openMin: number;
  closeHour: number;
  closeMin: number;
} | null {
  const match = timeStr.match(
    /(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i
  );
  if (!match) return null;

  const [, oh, om, oap, ch, cm, cap] = match;

  const to24 = (h: number, ap: string) => {
    if (ap === "PM" && h !== 12) return h + 12;
    if (ap === "AM" && h === 12) return 0;
    return h;
  };

  return {
    openHour: to24(Number(oh), oap.toUpperCase()),
    openMin: Number(om),
    closeHour: to24(Number(ch), cap.toUpperCase()),
    closeMin: Number(cm),
  };
}

function isOpen(outletTime: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parsed = parseTime(outletTime);
  if (!parsed) return false;

  const openMinutes = parsed.openHour * 60 + parsed.openMin;
  let closeMinutes = parsed.closeHour * 60 + parsed.closeMin;

  // overnight support
  if (closeMinutes <= openMinutes) closeMinutes += 24 * 60;

  return (
    currentMinutes >= openMinutes &&
    currentMinutes < closeMinutes
  );
}

/* ---------------- COMPONENT ---------------- */

export default function Home() {
  const [, forceUpdate] = useState(0);

  // re-check every minute
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const sortedOutlets = [...aromaChaiOutlets].sort((a, b) => {
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
              className={`relative my-6  transition-opacity
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
                    className={`flex items-center gap-1 px-3 py-2
                      text-xs font-medium text-white 
                      ${open ? "bg-[#2f9a3f]" : "bg-gray-400 pointer-events-none"}
                      `}
                  >
                    <MapPin className="h-4 w-4" />
                    Map
                  </Link>

                  <button
                    onClick={() =>
                      window.open(`tel:${outlet.phone}`, "_self")
                    }
                    className={`h-9 w-9 flex items-center justify-center
                      bg-[#1f7a30] text-white
                      ${open ? "bg-[#2f9a3f]" : "bg-gray-400 pointer-events-none"}
                      `}
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Closed Overlay */}
              {!open && (
                <div className="absolute inset-0 rounded-xl
                  bg-black/30 z-20 flex items-center justify-center">
                  <span className="text-gray-100 text-xs bg-green-700 px-2 py-1 rounded-sm font-semibold tracking-widest">
                    CLOSED
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
