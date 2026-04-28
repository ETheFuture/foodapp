"use client";

import Link from "next/link";
import { useTransition } from "react";
import { setDishFeatured } from "@/app/admin/actions";

export function AdminDishRow({
  id,
  name,
  restaurantName,
  isFeatured,
}: {
  id: string;
  name: string;
  restaurantName: string;
  isFeatured: boolean;
}) {
  const [p, start] = useTransition();
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-zinc-900">{name}</p>
        <p className="text-xs text-zinc-500">{restaurantName}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">
          {isFeatured ? "Uitgelicht" : "—"}
        </span>
        <Link
          className="text-sm text-[var(--accent)]"
          href={`/dish/${id}`}
        >
          Bekijken
        </Link>
        <button
          type="button"
          disabled={p}
          onClick={() =>
            start(() => {
              void setDishFeatured(id, !isFeatured);
            })
          }
          className="text-sm text-zinc-600"
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
