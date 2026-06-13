"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag } from "lucide-react";
import { track } from "@/lib/track";

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="relative mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-white px-6 py-1 shadow-lg">
      {/* LEFT — Home */}
      <Link href="/" className="flex flex-col items-center gap-1">
        <Home
          className={`size-5 ${
            pathname === "/" ? "text-[#155126]" : "text-[#53735b]"
          }`}
        />
        <span
          className={`text-xs font-medium ${
            pathname === "/" ? "text-[#155126]" : "text-[#53735b]"
          }`}
        >
          Home
        </span>
      </Link>

      {/* CENTER — Franchise (Raised, primary) */}
      <Link
        href="https://franchise.aromachai.in"
        onClick={() => track("franchise_click", { source: "nav" })}
        className="absolute left-1/2 -translate-x-1/2 -top-6"
      >
        <div className="flex h-20 w-24 flex-col items-center justify-center rounded-2xl bg-[#155126] shadow-xl">
          <Store className="size-6 text-white" />
          <span className="mt-1 text-[11px] font-semibold text-white">
            Franchise
          </span>
        </div>
      </Link>

      {/* RIGHT — Order Now */}
      <Link
        href="/order"
        onClick={() => track("nav_order_click")}
        className="flex flex-col items-center gap-1"
      >
        <ShoppingBag
          className={`size-5 ${
            pathname === "/order" ? "text-[#155126]" : "text-[#53735b]"
          }`}
        />
        <span
          className={`text-xs font-medium ${
            pathname === "/order" ? "text-[#155126]" : "text-[#53735b]"
          }`}
        >
          Order Now
        </span>
      </Link>
    </div>
  );
};

export default Header;
