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
      <div className="relative h-52 w-full overflow-hidden sm:h-64">
        {cover ? (
          <Image src={cover.imageUrl} alt={r.name} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="h-full w-full bg-zinc-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-12 sm:px-6">
        <div className="-mt-10">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">{r.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">{r.cuisineType} · {r.priceRange}</p>
        </div>

        {r.description && (
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">{r.description}</p>
        )}

        {/* Info */}
        <div className="mt-5 space-y-2 text-sm text-zinc-600">
          <p>{r.address}</p>
          {r.phone && <p>{r.phone}</p>}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--text)] text-sm font-semibold text-white transition hover:opacity-90"
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
              className="flex h-10 flex-1 items-center justify-center rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Website
            </a>
          )}
        </div>

        {/* Opening hours */}
        {hours && (
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04]">
            <p className="mb-2 text-xs font-medium text-zinc-400">Openingstijden</p>
            <ul className="space-y-1 text-sm">
              {Object.entries(hours)
                .filter(([k]) => k !== "note")
                .map(([day, v]) => (
                  <li key={day} className="flex justify-between">
                    <span className="capitalize text-zinc-500">{day}</span>
                    <span className="text-zinc-800">{v}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Dishes */}
        {r.dishes.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">Menu</h2>
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
