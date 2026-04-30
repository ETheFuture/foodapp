import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { getCategories, searchDishes } from "@/lib/data/dishes";
import { DishCard } from "@/components/DishCard";
import { SearchFilters } from "@/components/SearchFilters";

type SearchParams = {
  q?: string;
  categoryId?: string;
  maxDistance?: string;
  maxPrice?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const p = await searchParams;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const maxDistance = Math.min(500, Math.max(0.5, Number(p.maxDistance) || 500));
  const maxPrice = Math.max(5, Math.min(200, Number(p.maxPrice) || 150));

  let dishes: Awaited<ReturnType<typeof searchDishes>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let dbError: string | null = null;
  try {
    [dishes, categories] = await Promise.all([
      searchDishes({
        q: p.q ?? "",
        categoryId: p.categoryId || null,
        maxDistanceKm: maxDistance,
        maxPrice,
        onlyOpen: false,
        userLat: lat,
        userLon: lon,
      }),
      getCategories(),
    ]);
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Databasefout";
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-8 pt-6 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
        Search
      </h1>

      {dbError && (
        <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Geen databaseverbinding.
        </div>
      )}

      <div className="mt-5">
        <SearchFilters
          initial={{
            q: p.q ?? "",
            categoryId: p.categoryId ?? "",
            maxDistance: String(maxDistance),
            maxPrice: String(maxPrice),
            onlyOpen: false,
          }}
          categories={categories}
        />
      </div>

      {!dbError && (
        <p className="mt-6 text-xs font-medium text-zinc-400">
          {dishes.length} {dishes.length === 1 ? "gerecht" : "gerechten"}
        </p>
      )}

      {!dbError && dishes.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-2 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
            <svg className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <circle cx="10.5" cy="10.5" r="5.5" /><path d="M15 15l6 6" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-500">Geen resultaten.</p>
          <p className="text-xs text-zinc-400">Vergroot de afstand of wis je zoekterm.</p>
        </div>
      )}

      {!dbError && dishes.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {dishes.map((d, i) => (
            <DishCard key={d.id} dish={d} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
