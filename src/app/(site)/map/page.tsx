import Link from "next/link";
import { mapRestaurantsForMap } from "@/lib/data/restaurants";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";

export default async function MapPage() {
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const points = await mapRestaurantsForMap(lat, lon);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Kaart
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Klik op een restaurant voor de Bite-pagina, of open direct in Google Maps.
      </p>
      {points.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500">
          Nog geen actieve restaurants in de database. Wacht op de laatste deploy
          (seed draait tijdens de build) of controleer{" "}
          <code className="text-xs">/api/db-check</code>.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {points.map((p) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " " + p.address)}`;
            return (
              <li
                key={p.id}
                className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/restaurant/${p.id}`}
                    className="block font-medium text-zinc-900 hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-zinc-500">{p.address}</p>
                  <p className="text-xs text-zinc-400">
                    {p.distanceKm < 1
                      ? `${Math.round(p.distanceKm * 1000)} m`
                      : `${p.distanceKm.toFixed(1)} km`}{" "}
                    · {p.cuisineType}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/restaurant/${p.id}`}
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-800"
                  >
                    Profiel
                  </Link>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    Google Maps
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-6 text-sm text-zinc-500">
        <Link href="/" className="text-[var(--accent)]">
          Home
        </Link>{" "}
        ·{" "}
        <Link href="/search" className="text-[var(--accent)]">
          Ontdekken
        </Link>
      </p>
    </div>
  );
}
