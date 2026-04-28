"use client";

import { useTransition } from "react";
import Link from "next/link";
import { setRestaurantActive } from "@/app/admin/actions";

export function RestaurantRow({
  id,
  name,
  isActive,
  address,
}: {
  id: string;
  name: string;
  isActive: boolean;
  address: string;
}) {
  const [p, start] = useTransition();
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
      <div>
        <p className="font-medium text-zinc-900">{name}</p>
        <p className="text-xs text-zinc-500">{address}</p>
        <p className="text-xs text-zinc-400">{!isActive ? "Inactief" : "Actief"}</p>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/restaurant/${id}`}
          className="text-sm text-[var(--accent)]"
        >
          Publiek
        </Link>
        <button
          type="button"
          disabled={p}
          onClick={() =>
            start(() => {
              void setRestaurantActive(id, !isActive);
            })
          }
          className="text-sm text-zinc-600"
        >
          {isActive ? "Pauze" : "Activeer"}
        </button>
      </div>
    </div>
  );
}
