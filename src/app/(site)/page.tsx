import { Suspense } from "react";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { parseHomeRadiusParam } from "@/lib/home-radius";
import { searchDishes } from "@/lib/data/dishes";
import { DishFeedTile } from "@/components/DishFeedTile";
import { HomeBottomBar } from "@/components/HomeBottomBar";

type SearchParams = {
  q?: string;
  radius?: string;
};

function BarFallback() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 h-44 bg-white/80 backdrop-blur-sm" aria-hidden />
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const p = await searchParams;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const q = (p.q ?? "").trim();
  const radiusKm = parseHomeRadiusParam(p.radius);

  let dbError: string | null = null;
  let dishes: Awaited<ReturnType<typeof searchDishes>> = [];
  try {
    dishes = await searchDishes({
      q,
      categoryId: null,
      maxDistanceKm: radiusKm,
      maxPrice: 200,
      onlyOpen: false,
      userLat: lat,
      userLon: lon,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Onbekende databasefout";
    console.error("[home] feed load failed:", msg);
    dbError = msg;
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] pb-56">
      {dbError && (
        <div className="mx-4 mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
          Geen databaseverbinding.
        </div>
      )}

      {!dbError && dishes.length === 0 && (
        <div className="flex min-h-[50vh] items-center justify-center px-6 text-center">
          <div>
            <p className="text-sm text-zinc-500">
              Geen gerechten gevonden{q ? ` voor "${q}"` : ""}.
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Verschuif de afstand of wis het zoekveld.
            </p>
          </div>
        </div>
      )}

      {!dbError && dishes.length > 0 && (
        <div className="grid grid-cols-3 gap-px bg-zinc-200/60">
          {dishes.map((d, i) => (
            <DishFeedTile key={d.id} dish={d} priority={i < 9} />
          ))}
        </div>
      )}

      <Suspense fallback={<BarFallback />}>
        <HomeBottomBar defaultQ={q} />
      </Suspense>
    </div>
  );
}
