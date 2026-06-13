"use client";

import { useState, useTransition } from "react";
import { Megaphone } from "lucide-react";

import { saveOffer } from "@/app/admin/actions";

export default function OfferEditor({ initialOffer }: { initialOffer: string }) {
  const [text, setText] = useState(initialOffer);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveOffer(text);
      setMessage({ ok: res.ok, text: res.message });
    });
  }

  return (
    <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold">
        <Megaphone className="h-4 w-4 text-[#2f9a3f]" /> Offer banner
      </h2>
      <p className="mt-1 text-[10px] text-[#53735b]">
        Shows as a yellow banner on the homepage and every outlet page. Leave
        empty to hide it.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-xl border border-[#d6e8dc] px-3 py-2.5 text-sm outline-none focus:border-[#2f9a3f]"
          value={text}
          maxLength={120}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Monsoon Special: Chai + Punjabi Samosa @ ₹79 — this week only!"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="shrink-0 rounded-xl bg-[#155126] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {text && (
        <div className="mt-3 rounded-xl bg-amber-400 px-3 py-2.5 text-center text-xs font-bold text-[#3d2c00]">
          🎉 {text}
        </div>
      )}
      {message && (
        <p
          className={`mt-2 text-xs font-medium ${
            message.ok ? "text-[#2f9a3f]" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
