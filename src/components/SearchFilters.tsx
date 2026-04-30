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

const POPULAR_KEYWORDS = ["Burger", "Pizza", "Sushi", "Pasta", "Ramen", "Salade"];

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

  function navigate(overrides?: Partial<{ q: string; categoryId: string }>) {
    const sp = new URLSearchParams();
    const fq = overrides?.q ?? q;
    const fCat = overrides?.categoryId ?? categoryId;
    if (fq.trim()) sp.set("q", fq.trim());
    if (fCat) sp.set("categoryId", fCat);
    if (maxDistance) sp.set("maxDistance", maxDistance);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden
        >
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M15 15l6 6" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Zoek gerecht of keuken…"
          className="h-12 w-full rounded-2xl border-0 bg-white pl-11 pr-4 text-sm text-[var(--text)] shadow-sm ring-1 ring-black/[0.04] placeholder:text-zinc-400 focus:ring-2 focus:ring-[var(--accent)]/30 focus:outline-hidden"
        />
        {q && (
          <button
            type="button"
            onClick={() => { setQ(""); navigate({ q: "" }); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Recent Keywords */}
      <div>
        <p className="mb-2 text-sm font-semibold text-[var(--text)]">Recent Keywords</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => { setQ(kw); navigate({ q: kw }); }}
              className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="category-scroll flex gap-2 pb-1">
          <button
            type="button"
            onClick={() => { setCategoryId(""); navigate({ categoryId: "" }); }}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
              !categoryId
                ? "bg-[var(--accent)] text-white shadow-md shadow-orange-200"
                : "bg-white text-zinc-600 ring-1 ring-black/[0.04] hover:ring-[var(--accent)]"
            }`}
          >
            Alles
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                const next = c.id === categoryId ? "" : c.id;
                setCategoryId(next);
                navigate({ categoryId: next });
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                categoryId === c.id
                  ? "bg-[var(--accent)] text-white shadow-md shadow-orange-200"
                  : "bg-white text-zinc-600 ring-1 ring-black/[0.04] hover:ring-[var(--accent)]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Compact filters row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 ring-1 ring-black/[0.04]">
          <span className="text-[11px] text-zinc-500">Max</span>
          <input
            type="number"
            min={1}
            max={50}
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="w-8 bg-transparent text-xs font-semibold text-[var(--text)] focus:outline-hidden"
          />
          <span className="text-[11px] text-zinc-500">km</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 ring-1 ring-black/[0.04]">
          <span className="text-[11px] text-zinc-500">Max €</span>
          <input
            type="number"
            min={5}
            max={200}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-10 bg-transparent text-xs font-semibold text-[var(--text)] focus:outline-hidden"
          />
        </div>
        <button
          type="submit"
          className="ml-auto h-9 rounded-xl bg-[var(--accent)] px-5 text-xs font-semibold text-white shadow-md shadow-orange-200 transition hover:opacity-90"
        >
          Zoeken
        </button>
      </div>
    </form>
  );
}
