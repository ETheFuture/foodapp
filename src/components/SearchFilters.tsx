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
  const [onlyOpen, setOnlyOpen] = useState(initial.onlyOpen);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (categoryId) sp.set("categoryId", categoryId);
    if (maxDistance) sp.set("maxDistance", maxDistance);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    if (onlyOpen) sp.set("open", "1");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500"
            htmlFor="q"
          >
            Waar heb je zin in?
          </label>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Gerecht of trefwoord"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-0 focus:outline-hidden"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Categorie
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">Alles</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500"
            htmlFor="dmax"
          >
            Max. afstand (km)
          </label>
          <input
            id="dmax"
            type="number"
            min={1}
            max={50}
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500"
            htmlFor="pmax"
          >
            Max. prijs (€)
          </label>
          <input
            id="pmax"
            type="number"
            min={5}
            max={200}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"
          />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={onlyOpen}
              onChange={(e) => setOnlyOpen(e.target.checked)}
              className="rounded border-zinc-300"
            />
            Open nu (MVP: altijd aan)
          </label>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-full bg-[var(--text)] px-5 py-2 text-sm font-medium text-white"
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
            setOnlyOpen(false);
            router.push("/search");
          }}
          className="rounded-full border border-zinc-200 px-5 py-2 text-sm text-zinc-600"
        >
            Reset
        </button>
      </div>
    </form>
  );
}
