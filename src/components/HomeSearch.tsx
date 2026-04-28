"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export function HomeSearch() {
  const r = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (!t) {
      r.push("/search");
      return;
    }
    r.push(`/search?q=${encodeURIComponent(t)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <label className="sr-only" htmlFor="home-q">
        Zoek gerecht
      </label>
      <input
        id="home-q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="bijv. pizza, vegan ramen, burger…"
        className="h-12 flex-1 rounded-2xl border-0 bg-white/95 px-4 text-zinc-900 shadow-lg placeholder:text-zinc-400 focus:ring-2 focus:ring-white/50 focus:outline-hidden"
        autoComplete="off"
      />
      <button
        type="submit"
        className="h-12 rounded-2xl bg-[#c41e3a] px-8 text-sm font-semibold text-white shadow-lg transition hover:bg-[#a31830]"
      >
        Ontdek
      </button>
    </form>
  );
}
