import Link from "next/link";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { getCategories, searchDishes } from "@/lib/data/dishes";
import { DishCard } from "@/components/DishCard";
import { SearchFilters } from "@/components/SearchFilters";

type SearchParams = {
  q?: string;
  categoryId?: string;
  maxDistance?: string;
  maxPrice?: string;
  open?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const p = await searchParams;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const maxDistance = Math.min(50, Math.max(1, Number(p.maxDistance) || 10));
  const maxPrice = Math.max(5, Math.min(150, Number(p.maxPrice) || 80));
  const dishes = await searchDishes({
    q: p.q ?? "",
    categoryId: p.categoryId || null,
    maxDistanceKm: maxDistance,
    maxPrice,
    onlyOpen: p.open === "1",
    userLat: lat,
    userLon: lon,
  });
  const categories = await getCategories();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">
        Zoeken
      </h1>
      <p className="mt-2 text-sm text-zinc-500">Gerechten, niet adressen.</p>

      <div className="mt-8">
        <SearchFilters
          initial={{
            q: p.q ?? "",
            categoryId: p.categoryId ?? "",
            maxDistance: String(maxDistance),
            maxPrice: String(maxPrice),
            onlyOpen: p.open === "1",
          }}
          categories={categories}
        />
      </div>

      <p className="mt-6 text-sm text-zinc-500">
        {dishes.length} {dishes.length === 1 ? "gerecht" : "gerechten"} gevonden
      </p>
      {dishes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center text-zinc-500">
          Geen match. Probeer een bredere filter of iets anders.{" "}
          <Link href="/" className="font-medium text-[var(--accent)]">
            Home
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((d) => (
            <DishCard key={d.id} dish={d} />
          ))}
        </div>
      )}
    </div>
  );
}
