import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RestaurantForm } from "../_RestaurantForm";
import {
  updateRestaurantAction,
  deleteRestaurantAction,
} from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditRestaurantPage({ params }: Props) {
  const { id } = await params;
  const r = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      dishes: { select: { id: true, name: true }, orderBy: { name: "asc" } },
    },
  });
  if (!r) notFound();
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-zinc-500">
          <Link href="/admin/restaurants" className="hover:underline">
            ← Restaurants
          </Link>
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-semibold text-zinc-900">{r.name}</h1>
          <Link
            href={`/restaurant/${r.id}`}
            target="_blank"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Publieke pagina ↗
          </Link>
        </div>
      </div>

      <RestaurantForm
        action={updateRestaurantAction.bind(null, r.id)}
        restaurant={r}
        submitLabel="Wijzigingen opslaan"
      />

      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-900">Gerechten</h2>
          <Link
            href={`/admin/dishes/new?restaurantId=${r.id}`}
            className="text-sm font-medium text-[var(--accent)]"
          >
            + Nieuw gerecht
          </Link>
        </div>
        <ul className="mt-3 grid gap-1 text-sm text-zinc-700 sm:grid-cols-2">
          {r.dishes.map((d) => (
            <li key={d.id}>
              <Link
                href={`/admin/dishes/${d.id}`}
                className="hover:underline"
              >
                {d.name}
              </Link>
            </li>
          ))}
          {r.dishes.length === 0 && (
            <li className="text-zinc-500">Nog geen gerechten.</li>
          )}
        </ul>
      </div>

      <form
        action={deleteRestaurantAction.bind(null, r.id)}
        className="rounded-2xl border border-red-200 bg-red-50 p-5"
      >
        <p className="text-sm font-medium text-red-700">Gevarenzone</p>
        <p className="text-xs text-red-700/80">
          Verwijdert dit restaurant en al zijn gerechten/foto&apos;s.
        </p>
        <button className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
          Verwijder restaurant
        </button>
      </form>
    </div>
  );
}
