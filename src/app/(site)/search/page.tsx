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
  const maxDistance = Math.min(
    50,
    Math.max(0.5, Number(p.maxDistance) || 25),
  );
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
    <div className="mx-auto w-full max-w-lg px-4 pb-8 pt-4 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-[var(--text)]">
        Ontdekken
      </h1>

      {dbError && (
        <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
          Geen databaseverbinding.
        </div>
      )}

      <div className="mt-4">
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

      <p className="mt-5 text-xs text-zinc-400">
        {dbError
          ? "0 gerechten"
          : `${dishes.length} ${dishes.length === 1 ? "gerecht" : "gerechten"}`}
      </p>

      {!dbError && dishes.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-sm text-zinc-500">Geen resultaten.</p>
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
