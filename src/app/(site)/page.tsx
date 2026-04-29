import { Suspense } from "react";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { parseHomeRadiusParam } from "@/lib/home-radius";
import { searchDishes } from "@/lib/data/dishes";
import { DishFeedTile } from "@/components/DishFeedTile";
import { HomeBottomBar } from "@/components/HomeBottomBar";

type SP = { q?: string; radius?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const p = await searchParams;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const q = (p.q ?? "").trim();
  const radiusKm = parseHomeRadiusParam(p.radius);

  let dishes: Awaited<ReturnType<typeof searchDishes>> = [];
  let err: string | null = null;
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
    err = e instanceof Error ? e.message : "fout";
    console.error("[home]", err);
  }

  return (
    <main className="min-h-dvh bg-[#1c1c1e] pb-44 sm:pb-48">
      {err && (
        <div className="px-4 pt-4">
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/70">
            Geen verbinding met database.
          </div>
        </div>
      )}

      {!err && dishes.length === 0 && (
        <div className="flex min-h-[60vh] items-center justify-center px-8 text-center">
          <div>
            <p className="text-base font-medium text-white/60">
              {q ? `Geen resultaten voor "${q}"` : "Geen gerechten in de buurt"}
            </p>
            <p className="mt-2 text-sm text-white/40">
              Verschuif de afstand of pas je zoekopdracht aan.
            </p>
          </div>
        </div>
      )}

      {!err && dishes.length > 0 && (
        <div className="mx-auto w-full max-w-3xl px-1.5 pt-1.5 sm:px-3 sm:pt-3">
          <div className="grid grid-cols-3 gap-[3px] sm:gap-1.5 lg:gap-2">
            {dishes.map((d, i) => (
              <DishFeedTile key={d.id} dish={d} priority={i < 12} />
            ))}
          </div>
        </div>
      )}

      <Suspense
        fallback={<div className="fixed inset-x-0 bottom-0 z-50 h-36" aria-hidden />}
      >
        <HomeBottomBar defaultQ={q} />
      </Suspense>
    </main>
  );
}
