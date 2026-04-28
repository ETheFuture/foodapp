import { prisma } from "@/lib/prisma";
import {
  createCategoryAction,
  renameCategoryAction,
  deleteCategoryAction,
} from "../actions";

export default async function AdminCategoriesPage() {
  const cats = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { dishes: true } } },
  });
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900">Categorieën</h1>
      <p className="text-sm text-zinc-500">
        Worden getoond op de homepage en in zoekfilters.
      </p>

      <form
        action={createCategoryAction}
        className="mt-6 flex gap-2 rounded-2xl border border-zinc-200 bg-white p-3"
      >
        <input
          name="name"
          required
          placeholder="Nieuwe categorie (bv. Tapas)"
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Toevoegen
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {cats.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-zinc-200 bg-white p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <form
                action={renameCategoryAction.bind(null, c.id)}
                className="flex flex-1 items-center gap-2"
              >
                <input
                  name="name"
                  defaultValue={c.name}
                  className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                />
                <button className="rounded-lg border border-zinc-300 px-3 py-2 text-sm">
                  Hernoemen
                </button>
              </form>
              <span className="text-xs text-zinc-500">
                {c._count.dishes} gerecht{c._count.dishes === 1 ? "" : "en"}
              </span>
              <form action={deleteCategoryAction.bind(null, c.id)}>
                <button
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:opacity-50"
                  disabled={c._count.dishes > 0}
                  title={
                    c._count.dishes > 0
                      ? "Eerst gerechten weghalen of verplaatsen"
                      : ""
                  }
                >
                  Verwijderen
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
