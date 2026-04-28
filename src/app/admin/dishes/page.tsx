import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type SP = { q?: string; categoryId?: string; restaurantId?: string };

export default async function AdminDishesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const where: Prisma.DishWhereInput = {};
  if (sp.q && sp.q.trim()) where.name = { contains: sp.q.trim() };
  if (sp.categoryId) where.categoryId = sp.categoryId;
  if (sp.restaurantId) where.restaurantId = sp.restaurantId;

  const [dishes, categories, restaurants] = await Promise.all([
    prisma.dish.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        restaurant: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        images: { orderBy: { isMain: "desc" }, take: 1 },
      },
      take: 200,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.restaurant.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Gerechten</h1>
          <p className="text-sm text-zinc-500">{dishes.length} resultaat(en)</p>
        </div>
        <Link
          href="/admin/dishes/new"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          + Nieuw gerecht
        </Link>
      </div>

      <form
        method="get"
        className="mt-6 grid gap-2 rounded-2xl border border-zinc-200 bg-white p-3 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Zoek op naam"
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
        <select
          name="categoryId"
          defaultValue={sp.categoryId ?? ""}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="">Alle categorieën</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="restaurantId"
          defaultValue={sp.restaurantId ?? ""}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="">Alle restaurants</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Filter
        </button>
      </form>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((d) => {
          const img = d.images[0]?.imageUrl;
          return (
            <li key={d.id}>
              <Link
                href={`/admin/dishes/${d.id}`}
                className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-300"
              >
                <div className="relative aspect-[4/3] w-full bg-zinc-100">
                  {img ? (
                    <Image
                      src={img}
                      alt={d.name}
                      fill
                      className="object-cover transition group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                      geen foto
                    </div>
                  )}
                  {d.isFeatured && (
                    <span className="absolute left-2 top-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Uitgelicht
                    </span>
                  )}
                  {!d.isAvailable && (
                    <span className="absolute right-2 top-2 rounded-full bg-zinc-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Verborgen
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-zinc-900">{d.name}</p>
                  <p className="text-xs text-zinc-500">
                    {d.category.name} · {d.restaurant.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800">
                    €{d.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {dishes.length === 0 && (
        <p className="mt-12 rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
          Geen gerechten gevonden.
        </p>
      )}
    </div>
  );
}
