"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag } from "lucide-react";

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="relative mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-white px-6 py-1 shadow-lg">

      {/* LEFT — Home */}
      <Link href="/" className="flex flex-col items-center gap-1">
        <Home
          className={`size-5 ${
            pathname === "/" ? "text-green-700" : "text-gray-500"
          }`}
        />
        <span className={`text-xs text-gray-500
          ${
            pathname === "/" ? "text-green-700" : "text-gray-500"
          }`}>Home</span>
      </Link>

      {/* CENTER — Get Franchise (Raised) */}
      <Link
        href="/order"
        className="absolute left-1/2 -translate-x-1/2 -top-6 "
      >
        <div className="flex h-20 w-24 flex-col items-center justify-center rounded-2xl bg-white shadow-xl">
          <Store className={`size-6 
            ${
            pathname === "/order" ? "text-green-700" : "text-gray-500"
          }`}/>
          <span className={`mt-1 text-[10px] font-medium 
            ${
            pathname === "/order" ? "text-green-700" : "text-gray-500"
          }`}>
            Order Now
          </span>
        </div>
      </Link>

      {/* RIGHT — Order Online */}
      <Link href="https://outlet.aromachai.in/shop" className="flex flex-col items-center gap-1">
        <ShoppingBag
          className={`size-5 text-green-700`}
        />
        <span className="text-xs text-gray-500">Get Frenchise</span>
      </Link>

    </div>
  );
};

export default Header;
