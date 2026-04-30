import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { getCategories, searchDishes } from "@/lib/data/dishes";
import { HomeExperience } from "@/components/HomeExperience";

type SP = { q?: string; radius?: string; cat?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const p = await searchParams;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const initialQ = (p.q ?? "").trim();
  const initialCat = p.cat ?? "";

  let allDishes: Awaited<ReturnType<typeof searchDishes>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let err: string | null = null;
  try {
    [allDishes, categories] = await Promise.all([
      searchDishes({
        q: "",
        categoryId: null,
        maxDistanceKm: 500,
        maxPrice: 999,
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
      {err && (
        <div className="px-4 pt-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Geen verbinding met database.
          </div>
        </div>
      )}

      {!err && allDishes.length === 0 && (
        <div className="flex min-h-[50vh] items-center justify-center px-8 text-center">
          <div>
            <p className="text-base font-medium text-zinc-500">
              Nog geen gerechten in de database.
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Voer een deploy met DATABASE_URL uit en seed de database.
            </p>
          </div>
        </div>
      )}

      {!err && allDishes.length > 0 && (
        <HomeExperience
          allDishes={allDishes}
          categories={categories}
          initialQ={initialQ}
          initialCat={initialCat}
          initialRadiusParam={p.radius}
        />
      )}
    </main>
  );
}
