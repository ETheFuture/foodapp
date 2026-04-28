"use client";

import Link from "next/link";
import { useCallback } from "react";

type Props = {
  restaurantId: string;
  lat: number;
  lon: number;
};

export function ActionButtons({ restaurantId, lat, lon }: Props) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  const onRoute = useCallback(() => {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "route_click",
        entityType: "restaurant",
        entityId: restaurantId,
      }),
    });
  }, [restaurantId]);

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        onClick={onRoute}
        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#0a0a0a] px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        Route
      </a>
      <Link
        href={`/restaurant/${restaurantId}`}
        onClick={() =>
          void fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "click",
              entityType: "restaurant",
              entityId: restaurantId,
            }),
          })
        }
        className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900"
      >
        Bekijk restaurant
      </Link>
    </div>
  );
}
