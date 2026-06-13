import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { isLoggedIn } from "@/lib/auth";
import { getMasterMenu } from "@/lib/menu";
import MenuEditor from "@/component/admin/MenuEditor";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  if (!(await isLoggedIn())) redirect("/admin/login");

  const items = await getMasterMenu();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[#53735b]"
      >
        <ChevronLeft className="h-4 w-4" /> All outlets
      </Link>
      <h1 className="mt-2 text-lg font-semibold">Brand menu</h1>
      <p className="mt-1 text-xs text-[#53735b]">
        This is the master menu for all outlets. Items without a price stay
        hidden on the website. On each outlet&apos;s edit page you can switch
        items off or set a different price for that outlet only. Tap the ⭐
        to mark Best Sellers — the top 3 show in the spotlight on every
        outlet page.
      </p>
      <div className="mt-4">
        <MenuEditor initialItems={items} />
      </div>
    </div>
  );
}
