"use client";

import { useActionState } from "react";
import Image from "next/image";

import { loginAction, type ActionResult } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
      >
        <div className="flex justify-center">
          <div className="rounded-2xl bg-linear-to-br from-[#1B4D3E] to-[#2C7A63] px-6 py-3">
            <Image
              src="/images/aromaChaiLogo.png"
              alt="Aroma Chai"
              width={300}
              height={300}
              className="w-32 object-contain"
            />
          </div>
        </div>
        <h1 className="mt-4 text-center text-lg font-semibold">
          Outlet Admin Panel
        </h1>
        <p className="mt-1 text-center text-xs text-[#53735b]">
          Enter the admin password to manage outlets
        </p>

        <input
          type="password"
          name="password"
          placeholder="Admin password"
          autoFocus
          className="mt-5 w-full rounded-xl border border-[#d6e8dc] px-4 py-3 text-sm outline-none focus:border-[#2f9a3f]"
        />

        {state && !state.ok && (
          <p className="mt-2 text-xs font-medium text-red-600">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-xl bg-[#155126] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
