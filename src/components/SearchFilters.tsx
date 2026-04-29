"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";

type Cat = { id: string; name: string };

type Initial = {
  q: string;
  categoryId: string;
  maxDistance: string;
  maxPrice: string;
  onlyOpen: boolean;
};

export function SearchFilters({
  initial,
  categories,
}: {
  initial: Initial;
  categories: Cat[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initial.q);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [maxDistance, setMaxDistance] = useState(initial.maxDistance);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (categoryId) sp.set("categoryId", categoryId);
    if (maxDistance) sp.set("maxDistance", maxDistance);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden
        >
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M15 15l6 6" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Zoek gerecht of keuken…"
          className="h-11 w-full rounded-xl border-0 bg-zinc-100 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-zinc-50 focus:ring-2 focus:ring-[var(--accent)]/25 focus:outline-hidden"
        />
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setCategoryId("")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              !categoryId
                ? "bg-[var(--text)] text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            Alles
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id === categoryId ? "" : c.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                categoryId === c.id
                  ? "bg-[var(--text)] text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Compact filters row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-2.5 py-1.5">
          <span className="text-[11px] text-zinc-500">Max</span>
          <input
            type="number"
            min={1}
            max={50}
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="w-8 bg-transparent text-xs font-medium text-zinc-800 focus:outline-hidden"
          />
          <span className="text-[11px] text-zinc-500">km</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-2.5 py-1.5">
          <span className="text-[11px] text-zinc-500">Max</span>
          <span className="text-xs text-zinc-500">€</span>
          <input
            type="number"
            min={5}
            max={200}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-10 bg-transparent text-xs font-medium text-zinc-800 focus:outline-hidden"
          />
        </div>
        <button
          type="submit"
          className="ml-auto h-8 rounded-lg bg-[var(--accent)] px-4 text-xs font-semibold text-white transition hover:opacity-90"
        >
          Zoeken
        </button>
        <button
          type="button"
          onClick={() => {
            setQ("");
            setCategoryId("");
            setMaxDistance("10");
            setMaxPrice("80");
            router.push("/search");
          }}
          className="h-8 rounded-lg border border-zinc-200 px-3 text-xs text-zinc-500 hover:bg-zinc-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
