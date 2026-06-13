import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil, ExternalLink, UtensilsCrossed } from "lucide-react";

import { isLoggedIn } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllOutletRowsForAdmin } from "@/lib/outlets";
import { getOffer } from "@/lib/menu";
import { logoutAction } from "./actions";
import OfferEditor from "@/component/admin/OfferEditor";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isLoggedIn())) redirect("/admin/login");

  const configured = isSupabaseConfigured();
  const rows = configured ? await getAllOutletRowsForAdmin() : [];
  const offer = configured ? await getOffer() : "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Outlets</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/menu"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#155126] px-3 py-2 text-xs font-semibold text-white"
          >
            <UtensilsCrossed className="h-4 w-4" /> Menu
          </Link>
          <Link
            href="/admin/edit/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2f9a3f] px-3 py-2 text-xs font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Add outlet
          </Link>
          <form action={logoutAction}>
            <button className="rounded-xl border border-[#d6e8dc] px-3 py-2 text-xs font-semibold text-[#53735b]">
              Log out
            </button>
          </form>
        </div>
      </div>

      {configured && <OfferEditor initialOffer={offer} />}

      {!configured && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
          <strong>Supabase is not connected yet.</strong> The live site is
          showing the built-in outlet list. To add or edit outlets here, the
          Supabase keys must be added as environment variables (see the setup
          guide).
        </div>
      )}

      {configured && rows.length === 0 && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
          <strong>The database is empty.</strong> Run the seed SQL from the
          setup guide to load your 10 outlets, or add the first outlet with
          the button above.
        </div>
      )}

      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2f9a3f] text-xs font-semibold text-white">
              {row.code}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {row.name}
                {!row.active && (
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                    Hidden
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-[#53735b]">
                {row.area} · {row.time}
              </p>
            </div>
            <a
              href={`/${row.city
                .split(/[–—-]/)[0]
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")}/${row.slug}`}
              target="_blank"
              className="rounded-lg border border-[#d6e8dc] p-2 text-[#53735b]"
              title="View live page"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href={`/admin/edit/${row.id}`}
              className="rounded-lg bg-[#155126] p-2 text-white"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
