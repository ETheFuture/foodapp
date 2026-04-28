"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDishAction } from "@/app/dashboard/dish-actions";

type Cat = { id: string; name: string };
type Tg = { id: string; name: string };

export function NewDishForm({
  restaurantId,
  categories,
  tags,
}: {
  restaurantId: string;
  categories: Cat[];
  tags: Tg[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  function onSubmit(f: FormData) {
    setErr(null);
    const tagIds = tags
      .filter((t) => f.get(`tag-${t.id}`) === "on")
      .map((t) => t.id);
    const mainImageUrl = String(f.get("mainImageUrl") ?? "").trim() || undefined;
    start(async () => {
      const r = await createDishAction({
        restaurantId,
        name: String(f.get("name") ?? "").trim(),
        description: String(f.get("description") ?? "").trim() || undefined,
        price: Number(f.get("price")),
        categoryId: String(f.get("categoryId") ?? ""),
        isAvailable: f.get("isAvailable") === "on",
        isFeatured: f.get("isFeatured") === "on",
        mainImageUrl,
        tagIds,
      });
      if (r && "error" in r) setErr(r.error ?? "Fout");
      else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-zinc-300 py-4 text-sm font-medium text-zinc-600"
      >
        + Nieuw gerecht
      </button>
    );
  }

  return (
    <form
      className="rounded-2xl border border-zinc-200 bg-white p-4"
      action={(f) => onSubmit(f)}
    >
      <h2 className="text-sm font-semibold text-zinc-900">Nieuw gerecht</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input
            name="name"
            required
            placeholder="Naam"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <textarea
            name="description"
            rows={2}
            placeholder="Beschrijving"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </div>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="Prijs"
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
        <select
          name="categoryId"
          required
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="sm:col-span-2">
          <input
            name="mainImageUrl"
            type="url"
            placeholder="Foto-URL (Unsplash…)"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          <input name="isAvailable" type="checkbox" defaultChecked />
          Zichtbaar
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          <input name="isFeatured" type="checkbox" />
          Uitgelicht
        </label>
        <div className="sm:col-span-2">
          <p className="mb-1 text-xs text-zinc-500">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <label key={t.id} className="flex items-center gap-1 text-sm">
                <input name={`tag-${t.id}`} type="checkbox" id={`tag-${t.id}`} />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white"
        >
          {pending ? "…" : "Opslaan"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm"
        >
          Annuleer
        </button>
      </div>
    </form>
  );
}
