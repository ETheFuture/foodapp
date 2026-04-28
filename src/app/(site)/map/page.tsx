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
        Tik op een locatie om Google Maps te openen. Geen interne map tile (MVP).
      </p>
      <ul className="mt-8 space-y-2">
        {points.map((p) => {
          const href = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`;
          return (
            <li key={p.id}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-300"
              >
                <div>
                  <p className="font-medium text-zinc-900">{p.name}</p>
                  <p className="text-xs text-zinc-500">{p.address}</p>
                </div>
                <div className="text-right text-sm text-zinc-500">
                  {p.distanceKm < 1
                    ? `${Math.round(p.distanceKm * 1000)} m`
                    : `${p.distanceKm.toFixed(1)} km`}
                </div>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-sm text-zinc-500">
        <Link href="/" className="text-[var(--accent)]">
          Home
        </Link>
      </p>
    </div>
  );
}
