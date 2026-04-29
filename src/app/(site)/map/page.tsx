import Link from "next/link";
import { mapRestaurantsForMap } from "@/lib/data/restaurants";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";

export default async function MapPage() {
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const points = await mapRestaurantsForMap(lat, lon);

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-8 pt-4 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-[var(--text)]">
        Restaurants
      </h1>
      <p className="mt-1 text-xs text-zinc-400">
        {points.length} locaties · gesorteerd op afstand
      </p>

      {points.length === 0 ? (
        <p className="mt-12 text-center text-sm text-zinc-500">
          Nog geen restaurants beschikbaar.
        </p>
      ) : (
        <ul className="mt-5 space-y-2">
          {points.map((p) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " " + p.address)}`;
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/[0.04]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/restaurant/${p.id}`}
                    className="block text-sm font-semibold text-[var(--text)] hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="truncate text-xs text-zinc-500">{p.address}</p>
                  <p className="text-[11px] text-zinc-400">
                    {p.distanceKm < 1
                      ? `${Math.round(p.distanceKm * 1000)}m`
                      : `${p.distanceKm.toFixed(1)}km`}{" "}
                    · {p.cuisineType}
                  </p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200"
                  title="Open in Google Maps"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
