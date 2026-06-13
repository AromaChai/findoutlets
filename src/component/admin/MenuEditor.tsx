"use client";

import { useState, useTransition } from "react";
import { Trash2, Plus, Star } from "lucide-react";

import { saveMasterMenu } from "@/app/admin/actions";
import type { MenuItem } from "@/lib/menu";

const inputCls =
  "rounded-xl border border-[#d6e8dc] bg-white px-3 py-2 text-sm outline-none focus:border-[#2f9a3f]";

export default function MenuEditor({
  initialItems,
}: {
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [newCategory, setNewCategory] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  const categories = [...new Set(items.map((i) => i.category))];

  function updateItem(id: string, patch: Partial<MenuItem>) {
    setItems(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function addItem(category: string) {
    setItems([
      ...items,
      { id: crypto.randomUUID(), category, name: "", price: null },
    ]);
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveMasterMenu(items);
      setMessage({ ok: res.ok, text: res.message });
    });
  }

  return (
    <div className="space-y-4 pb-24">
      {categories.map((category) => (
        <div key={category} className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">{category}</h2>
          <div className="mt-2 space-y-2">
            {items
              .filter((i) => i.category === category)
              .map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Best seller — shown at the top of outlet pages"
                    onClick={() =>
                      updateItem(item.id, { bestseller: !item.bestseller })
                    }
                    className="shrink-0"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        item.bestseller
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                  <input
                    className={`${inputCls} min-w-0 flex-1`}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    placeholder="Item name"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#53735b]">₹</span>
                    <input
                      className={`${inputCls} w-20`}
                      inputMode="numeric"
                      value={item.price ?? ""}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^\d]/g, "");
                        updateItem(item.id, {
                          price: v === "" ? null : Number(v),
                        });
                      }}
                      placeholder="—"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                    className="shrink-0 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
          <button
            type="button"
            onClick={() => addItem(category)}
            className="mt-3 inline-flex items-center gap-1 rounded-xl border border-[#d6e8dc] px-3 py-1.5 text-xs font-semibold text-[#155126]"
          >
            <Plus className="h-3.5 w-3.5" /> Add item
          </button>
        </div>
      ))}

      {/* New category */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold">New category</h2>
        <div className="mt-2 flex gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Momos"
          />
          <button
            type="button"
            onClick={() => {
              if (!newCategory.trim()) return;
              addItem(newCategory.trim());
              setNewCategory("");
            }}
            className="rounded-xl bg-[#2f9a3f] px-4 py-2 text-xs font-semibold text-white"
          >
            Add
          </button>
        </div>
      </div>

      {/* Save bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#e3efe7] bg-white p-3">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="w-full rounded-xl bg-[#155126] py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save menu"}
          </button>
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
      </div>
    </div>
  );
}
