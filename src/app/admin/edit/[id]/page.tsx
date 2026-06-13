import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { isLoggedIn } from "@/lib/auth";
import { getOutletRowForAdmin } from "@/lib/outlets";
import { getMasterMenu } from "@/lib/menu";
import OutletForm from "@/component/admin/OutletForm";

export const dynamic = "force-dynamic";

export default async function EditOutletPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isLoggedIn())) redirect("/admin/login");

  const { id } = await params;
  const isNew = id === "new";
  const row = isNew ? null : await getOutletRowForAdmin(id);
  if (!isNew && !row) notFound();
  const masterMenu = await getMasterMenu();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[#53735b]"
      >
        <ChevronLeft className="h-4 w-4" /> All outlets
      </Link>
      <h1 className="mt-2 text-lg font-semibold">
        {isNew ? "Add new outlet" : `Edit: ${row!.name}`}
      </h1>
      <p className="mt-1 text-xs text-[#53735b]">
        Fill the details below — the outlet page is created and updated
        automatically with proper local SEO.
      </p>
      <div className="mt-4">
        <OutletForm row={row} masterMenu={masterMenu} />
      </div>
    </div>
  );
}
