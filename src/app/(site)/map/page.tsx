import Link from "next/link";
import { mapRestaurantsForMap } from "@/lib/data/restaurants";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";

export default async function MapPage() {
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const points = await mapRestaurantsForMap(lat, lon);

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-8 pt-6 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
        Restaurants
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        {points.length} locaties · gesorteerd op afstand
      </p>

      {points.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
            <svg className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-500">Nog geen restaurants beschikbaar.</p>
        </div>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {points.map((p) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " " + p.address)}`;
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-sm font-bold text-[var(--accent)]">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/restaurant/${p.id}`}
                    className="block text-sm font-bold text-[var(--text)] hover:text-[var(--accent)]"
                  >
                    {p.name}
                  </Link>
                  <p className="truncate text-xs text-zinc-500">{p.address}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">
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
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-sm transition hover:opacity-90"
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
