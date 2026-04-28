import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurantById } from "@/lib/data/restaurants";
import { TrackView } from "@/components/TrackView";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { distanceKm } from "@/lib/geo";
import { DishCard } from "@/components/DishCard";
import type { DishListItem, DishWithRelations } from "@/lib/data/dishes";

type PageProps = { params: Promise<{ id: string }> };

function toListItem(
  d: DishWithRelations,
  userLat: number,
  userLon: number,
): DishListItem {
  return {
    ...d,
    distanceKm: distanceKm(
      userLat,
      userLon,
      d.restaurant.latitude,
      d.restaurant.longitude,
    ),
  };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const r = await getRestaurantById(id);
  if (!r) notFound();

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}`;

  let hours: Record<string, string> | null = null;
  try {
    if (r.openingHours) {
      const o = JSON.parse(r.openingHours) as Record<string, string>;
      hours = o;
    }
  } catch {
    hours = null;
  }

  const cover = r.dishes[0]?.images[0];

  return (
    <div>
      <TrackView entityType="restaurant" entityId={r.id} />
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        {cover ? (
          <Image
            src={cover.imageUrl}
            alt={r.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-zinc-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {r.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {r.cuisineType} · {r.priceRange}
        </p>
        {r.description && (
          <p className="mt-4 text-zinc-600 leading-relaxed">{r.description}</p>
        )}

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <p className="text-zinc-800">{r.address}</p>
          {r.phone && <p className="text-zinc-600">Tel. {r.phone}</p>}
          {r.website && (
            <a
              href={r.website}
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Website
            </a>
          )}
          {r.instagram && <p className="text-zinc-600">{r.instagram}</p>}
        </div>

        {hours && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-zinc-500">Openingstijden</h2>
            <ul className="mt-2 space-y-1 text-sm text-zinc-800">
              {Object.entries(hours)
                .filter(([k]) => k !== "note")
                .map(([day, v]) => (
                  <li key={day} className="flex justify-between gap-4">
                    <span className="capitalize text-zinc-500">{day}</span>
                    <span>{v}</span>
                  </li>
                ))}
            </ul>
            {hours.note && (
              <p className="mt-2 text-xs text-zinc-500">{String(hours.note)}</p>
            )}
          </div>
        )}

        <div className="mt-6">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#0a0a0a] px-6 text-sm font-semibold text-white"
          >
            Route
          </a>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-900">Gerechten</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {r.dishes.map((d) => (
              <DishCard key={d.id} dish={toListItem(d, lat, lon)} />
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          <Link href="/search" className="text-[var(--accent)] hover:underline">
            Terug naar zoeken
          </Link>
        </p>
      </div>
    </div>
  );
}
