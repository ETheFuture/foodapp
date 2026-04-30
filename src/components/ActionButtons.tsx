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
    <div className="mt-3 flex gap-2">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        onClick={onRoute}
        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:opacity-90"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
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
        className="flex h-11 flex-1 items-center justify-center rounded-xl border-2 border-[var(--accent)] text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-light)]"
      >
        Bekijk restaurant
      </Link>
    </div>
  );
}
