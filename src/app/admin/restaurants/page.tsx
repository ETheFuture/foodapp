import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminRestaurantsPage() {
  const list = await prisma.restaurant.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { dishes: true } } },
  });
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Restaurants</h1>
          <p className="text-sm text-zinc-500">{list.length} totaal</p>
        </div>
        <Link
          href="/admin/restaurants/new"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          + Nieuw restaurant
        </Link>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {list.map((r) => (
          <li key={r.id}>
            <Link
              href={`/admin/restaurants/${r.id}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-zinc-900">{r.name}</p>
                <span
                  className={
                    r.isActive
                      ? "rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700"
                      : "rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600"
                  }
                >
                  {r.isActive ? "Actief" : "Pauze"}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{r.cuisineType} · {r.priceRange}</p>
              <p className="mt-1 text-xs text-zinc-500">{r.address}</p>
              <p className="mt-2 text-xs text-zinc-400">
                {r._count.dishes} gerecht{r._count.dishes === 1 ? "" : "en"}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="mt-12 rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
          Nog geen restaurants. Maak er één aan.
        </p>
      )}
    </div>
  );
}
