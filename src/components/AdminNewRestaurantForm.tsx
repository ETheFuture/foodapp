"use client";

import { useState, useTransition } from "react";
import { createRestaurantAction } from "@/app/admin/actions";

export function NewRestaurantForm() {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [p, start] = useTransition();
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full max-w-sm rounded-2xl border border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-600"
      >
        + Restaurant
      </button>
    );
  }
  return (
    <form
      className="max-w-sm space-y-2 rounded-2xl border border-zinc-200 bg-white p-4"
      action={(f) => {
        setErr(null);
        start(async () => {
          const r = await createRestaurantAction({
            name: String(f.get("name") ?? "").trim(),
            address: String(f.get("address") ?? "").trim(),
            description: String(f.get("description") ?? "").trim() || undefined,
            priceRange: String(f.get("priceRange") ?? "€€"),
            cuisineType: String(f.get("cuisineType") ?? "").trim(),
            latitude: Number(f.get("lat")),
            longitude: Number(f.get("lon")),
          });
          if (r && "error" in r) setErr(r.error ?? "Fout");
          else setOpen(false);
        });
      }}
    >
      <h2 className="text-sm font-semibold">Nieuw (minimaal)</h2>
      <input
        name="name"
        placeholder="Naam"
        required
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
      />
      <input
        name="address"
        placeholder="Adres"
        required
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
      />
      <textarea
        name="description"
        placeholder="Beschrijving"
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        rows={2}
      />
      <input
        name="cuisineType"
        placeholder="Keuken"
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        required
      />
      <input
        name="priceRange"
        defaultValue="€€"
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          name="lat"
          type="number"
          step="any"
          defaultValue="52.3676"
          required
        />
        <input
          name="lon"
          type="number"
          step="any"
          defaultValue="4.9041"
          required
        />
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white"
          disabled={p}
        >
          Opslaan
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm"
          onClick={() => setOpen(false)}
        >
          Sluit
        </button>
      </div>
    </form>
  );
}
