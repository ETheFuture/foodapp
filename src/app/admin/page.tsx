import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ImportSamplesButton } from "./_components/ImportSamplesButton";

export default async function AdminHome() {
  let stats = { restaurants: 0, dishes: 0, categories: 0, views: 0 };
  let dbError: string | null = null;
  try {
    const [restaurants, dishes, categories, views] = await Promise.all([
      prisma.restaurant.count(),
      prisma.dish.count(),
      prisma.category.count(),
      prisma.analyticsEvent.count({ where: { type: "view" } }),
    ]);
    stats = { restaurants, dishes, categories, views };
  } catch (e) {
    dbError = e instanceof Error ? e.message : "DB onbereikbaar";
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Beheer</h1>
          <p className="text-sm text-zinc-500">Bite — dish-first.</p>
        </div>
        <ImportSamplesButton />
      </div>

      {dbError && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          DB-fout: {dbError}. Check <code>/api/db-check</code>.
        </p>
      )}

      <ul className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ["Restaurants", stats.restaurants, "/admin/restaurants"],
          ["Gerechten", stats.dishes, "/admin/dishes"],
          ["Categorieën", stats.categories, "/admin/categories"],
          ["Views (events)", stats.views, "/admin/stats"],
        ].map(([a, c, href]) => (
          <li
            key={String(a)}
            className="rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500">{a}</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-900">{c}</p>
            <Link
              href={String(href)}
              className="mt-2 inline-block text-sm font-medium text-[var(--accent)]"
            >
              Beheren →
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/dishes/new"
          className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300"
        >
          <p className="text-sm font-semibold text-zinc-900">+ Nieuw gerecht</p>
          <p className="mt-1 text-sm text-zinc-500">
            Foto, prijs, categorie, restaurant — verschijnt direct op de homepage.
          </p>
        </Link>
        <Link
          href="/admin/restaurants/new"
          className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300"
        >
          <p className="text-sm font-semibold text-zinc-900">+ Nieuw restaurant</p>
          <p className="mt-1 text-sm text-zinc-500">
            Inclusief locatie en openingstijden.
          </p>
        </Link>
      </div>
    </div>
  );
}
