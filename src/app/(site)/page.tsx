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

function HomeFeedBarFallback() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 h-40 border-t border-zinc-200/90 bg-[var(--bg)]/80 backdrop-blur-sm"
      aria-hidden
    />
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
    <div className="min-h-dvh bg-[var(--bg)] pb-[min(32rem,78vh)]">
      <p className="sr-only">
        Gerechtenfeed,{" "}
        {radiusKm < 1
          ? `binnen ${Math.round(radiusKm * 1000)} meter`
          : `binnen ${radiusKm} kilometer`}
        {q ? `, zoekopdracht ${q}` : ""}, ten opzichte van Amsterdam.
      </p>

      {dbError && (
        <div className="mx-3 my-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 sm:mx-4">
          <p className="font-medium">Geen databaseverbinding.</p>
          <p className="mt-1 text-xs opacity-80">
            Controleer <code className="rounded bg-white/70 px-1">DATABASE_URL</code>{" "}
            op Vercel.
          </p>
        </div>
      )}

      {!dbError && dishes.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center px-4 text-center">
          <p className="text-sm text-zinc-500">
            Geen gerechten binnen deze afstand
            {q ? " en zoekterm" : ""}. Verschuif de afstand of wis het zoekveld.
          </p>
        </div>
      )}

      {!dbError && dishes.length > 0 && (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-0.5">
          {dishes.map((d, i) => (
            <DishFeedTile key={d.id} dish={d} priority={i < 9} />
          ))}
        </div>
      )}

      <Suspense fallback={<HomeFeedBarFallback />}>
        <HomeBottomBar defaultQ={q} />
      </Suspense>
    </div>
  );
}
