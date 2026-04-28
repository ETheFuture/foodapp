"use client";

import { useState, useTransition } from "react";
import { updateDishAction } from "@/app/dashboard/dish-actions";
import type { Prisma } from "@prisma/client";

type Cat = { id: string; name: string };
type Tg = { id: string; name: string };

type DishT = Prisma.DishGetPayload<{
  include: {
    category: true;
    images: { take: 2 };
    tags: { include: { tag: true } };
  };
}>;

export function DishRowForm({
  dish,
  categories,
  tags,
}: {
  dish: DishT;
  categories: Cat[];
  tags: Tg[];
  restaurantId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const main = dish.images.find((i) => i.isMain) ?? dish.images[0];
  const tagSet = new Set(dish.tags.map((x) => x.tagId));

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
        <div>
          <p className="font-medium text-zinc-900">{dish.name}</p>
          <p className="text-xs text-zinc-500">
            {dish.category.name} · €{dish.price.toFixed(2).replace(".", ",")}
            {!dish.isAvailable && " · niet actief"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 text-sm text-[var(--accent)]"
        >
          Wijzig
        </button>
      </div>
    );
  }

  function onSubmit(f: FormData) {
    setErr(null);
    const tagIds = tags
      .filter((t) => f.get(`tag-${t.id}`) === "on")
      .map((t) => t.id);
    const mainImageUrl = String(f.get("mainImageUrl") ?? "").trim() || undefined;
    start(async () => {
      const r = await updateDishAction({
        id: dish.id,
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
      else setEditing(false);
    });
  }

  return (
    <form
      className="rounded-2xl border border-zinc-200 bg-white p-4"
      action={(f) => onSubmit(f)}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input
            name="name"
            required
            defaultValue={dish.name}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <textarea
            name="description"
            rows={2}
            defaultValue={dish.description ?? ""}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </div>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={dish.price}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
        <select
          name="categoryId"
          required
          defaultValue={dish.categoryId}
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
            placeholder="Foto-URL"
            defaultValue={main?.imageUrl ?? ""}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          <input
            name="isAvailable"
            type="checkbox"
            defaultChecked={dish.isAvailable}
          />
          Zichtbaar
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          <input
            name="isFeatured"
            type="checkbox"
            defaultChecked={dish.isFeatured}
          />
          Uitgelicht
        </label>
        <div className="sm:col-span-2">
          <p className="mb-1 text-xs text-zinc-500">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <label key={t.id} className="flex items-center gap-1 text-sm">
                <input
                  name={`tag-${t.id}`}
                  type="checkbox"
                  id={`d-${dish.id}-t-${t.id}`}
                  defaultChecked={tagSet.has(t.id)}
                />
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
          onClick={() => setEditing(false)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm"
        >
          Sluit
        </button>
      </div>
    </form>
  );
}
