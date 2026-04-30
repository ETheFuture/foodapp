import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurantById } from "@/lib/data/restaurants";
import { TrackView } from "@/components/TrackView";
import { AMSTERDAM_DEFAULT, distanceKm } from "@/lib/geo";
import { DishCard } from "@/components/DishCard";
import type { DishListItem, DishWithRelations } from "@/lib/data/dishes";

type PageProps = { params: Promise<{ id: string }> };

function toListItem(d: DishWithRelations, userLat: number, userLon: number): DishListItem {
  return {
    ...d,
    distanceKm: distanceKm(userLat, userLon, d.restaurant.latitude, d.restaurant.longitude),
  };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const r = await getRestaurantById(id);
  if (!r) notFound();

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}`;
  const cover = r.dishes[0]?.images[0];

  let hours: Record<string, string> | null = null;
  try {
    if (r.openingHours) hours = JSON.parse(r.openingHours) as Record<string, string>;
  } catch { hours = null; }

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <TrackView entityType="restaurant" entityId={r.id} />

      {/* Cover */}
      <div className="relative mx-auto max-w-lg overflow-hidden sm:px-4 sm:pt-4">
        <div className="relative h-52 w-full overflow-hidden sm:h-64 sm:rounded-2xl">
          {cover ? (
            <Image src={cover.imageUrl} alt={r.name} fill className="object-cover" priority sizes="100vw" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-orange-100 to-amber-50" />
          )}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-12 sm:px-6">
        {/* Name + info */}
        <div className="mt-5">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">{r.name}</h1>
          {r.description && (
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{r.description}</p>
          )}
        </div>

        {/* Rating row */}
        <div className="mt-4 flex items-center gap-5 text-sm text-zinc-500">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-semibold text-[var(--text)]">4.7</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10l3-2 3 2 3-2" />
            </svg>
            <span>{r.priceRange}</span>
          </div>
          <span className="text-zinc-300">|</span>
          <span>{r.cuisineType}</span>
        </div>

        {/* Category pills */}
        <div className="category-scroll mt-4 flex gap-2 pb-1">
          {r.cuisineType.split(/[,/·]/).map((c) => (
            <span
              key={c.trim()}
              className="shrink-0 rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white"
            >
              {c.trim()}
            </span>
          ))}
        </div>

        {/* Info */}
        <div className="mt-5 space-y-2 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" /><circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>{r.address}</span>
          </div>
          {r.phone && (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{r.phone}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            Route
          </a>
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 flex-1 items-center justify-center rounded-xl border-2 border-[var(--accent)] text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-light)]"
            >
              Website
            </a>
          )}
        </div>

        {/* Opening hours */}
        {hours && (
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Openingstijden</p>
            <ul className="space-y-1 text-sm">
              {Object.entries(hours)
                .filter(([k]) => k !== "note")
                .map(([day, v]) => (
                  <li key={day} className="flex justify-between">
                    <span className="capitalize text-zinc-500">{day}</span>
                    <span className="font-medium text-[var(--text)]">{v}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Dishes */}
        {r.dishes.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-[var(--text)]">
              Menu ({r.dishes.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {r.dishes.map((d) => (
                <DishCard key={d.id} dish={toListItem(d, lat, lon)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
