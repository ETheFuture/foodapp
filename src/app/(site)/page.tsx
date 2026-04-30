import { Suspense } from "react";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { parseHomeRadiusParam } from "@/lib/home-radius";
import { searchDishes, getCategories } from "@/lib/data/dishes";
import { DishFeedTile } from "@/components/DishFeedTile";
import { HomeBottomBar } from "@/components/HomeBottomBar";
import { CategoryScroller } from "@/components/CategoryScroller";

type SP = { q?: string; radius?: string; cat?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const p = await searchParams;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const q = (p.q ?? "").trim();
  const radiusKm = parseHomeRadiusParam(p.radius);
  const activeCat = p.cat ?? "";

  let dishes: Awaited<ReturnType<typeof searchDishes>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let err: string | null = null;
  try {
    [dishes, categories] = await Promise.all([
      searchDishes({
        q,
        categoryId: activeCat || null,
        maxDistanceKm: radiusKm,
        maxPrice: 200,
        onlyOpen: false,
        userLat: lat,
        userLon: lon,
      }),
      getCategories(),
    ]);
  } catch (e) {
    err = e instanceof Error ? e.message : "fout";
    console.error("[home]", err);
  }

  return (
    <main className="min-h-dvh bg-[var(--bg)] pb-44 sm:pb-48">
      {/* Category scroller */}
      {!err && categories.length > 0 && (
        <div className="px-4 pt-5 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text)]">All Categories</h2>
            </div>
            <Suspense fallback={null}>
              <CategoryScroller categories={categories} activeCat={activeCat} />
            </Suspense>
          </div>
        </div>
      )}

      {err && (
        <div className="px-4 pt-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Geen verbinding met database.
          </div>
        </div>
      )}

      {!err && dishes.length === 0 && (
        <div className="flex min-h-[50vh] items-center justify-center px-8 text-center">
          <div>
            <p className="text-base font-medium text-zinc-500">
              {q ? `Geen resultaten voor "${q}"` : "Geen gerechten in de buurt"}
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Verschuif de afstand of pas je zoekopdracht aan.
            </p>
          </div>
        </div>
      )}

      {!err && dishes.length > 0 && (
        <div className="mx-auto w-full max-w-3xl px-3 pt-4 sm:px-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-3">
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
