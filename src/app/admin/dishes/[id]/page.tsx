import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DishForm } from "../_DishForm";
import {
  updateDishAction,
  deleteDishAction,
  addDishImageAction,
  deleteDishImageAction,
  setMainImageAction,
} from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditDishPage({ params }: Props) {
  const { id } = await params;
  const [dish, categories, restaurants, tags] = await Promise.all([
    prisma.dish.findUnique({
      where: { id },
      include: {
        images: { orderBy: { isMain: "desc" } },
        tags: { select: { tagId: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.restaurant.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!dish) notFound();

  const main = dish.images.find((i) => i.isMain) ?? dish.images[0];
  const others = dish.images.filter((i) => i.id !== main?.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-zinc-500">
          <Link href="/admin/dishes" className="hover:underline">
            ← Gerechten
          </Link>
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-semibold text-zinc-900">{dish.name}</h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/dish/${dish.id}`}
              target="_blank"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Publieke pagina ↗
            </Link>
          </div>
        </div>
      </div>

      <DishForm
        action={updateDishAction.bind(null, dish.id)}
        dish={{
          name: dish.name,
          description: dish.description,
          price: dish.price,
          categoryId: dish.categoryId,
          restaurantId: dish.restaurantId,
          isAvailable: dish.isAvailable,
          isFeatured: dish.isFeatured,
        }}
        mainImageUrl={main?.imageUrl}
        categories={categories}
        restaurants={restaurants}
        tags={tags}
        selectedTagIds={dish.tags.map((t) => t.tagId)}
        submitLabel="Wijzigingen opslaan"
      />

      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-900">Extra foto&apos;s</h2>
        <p className="text-xs text-zinc-500">
          Naast de hoofdfoto. Klik &quot;Maak hoofdfoto&quot; om te wisselen.
        </p>

        {others.length > 0 && (
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {others.map((im) => (
              <li
                key={im.id}
                className="overflow-hidden rounded-xl border border-zinc-200"
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    src={im.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="flex justify-between gap-2 p-2 text-xs">
                  <form action={setMainImageAction.bind(null, dish.id, im.id)}>
                    <button className="text-[var(--accent)]">
                      Maak hoofdfoto
                    </button>
                  </form>
                  <form action={deleteDishImageAction.bind(null, dish.id, im.id)}>
                    <button className="text-red-600">Verwijder</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form
          action={addDishImageAction.bind(null, dish.id)}
          className="mt-4 flex flex-col gap-2 sm:flex-row"
        >
          <input
            name="imageUrl"
            type="url"
            required
            placeholder="https://..."
            className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
          <label className="inline-flex items-center gap-1 text-sm text-zinc-600">
            <input type="checkbox" name="isMain" />
            als hoofdfoto
          </label>
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
            Foto toevoegen
          </button>
        </form>
      </div>

      <form
        action={deleteDishAction.bind(null, dish.id)}
        className="rounded-2xl border border-red-200 bg-red-50 p-5"
      >
        <p className="text-sm font-medium text-red-700">Gevarenzone</p>
        <p className="text-xs text-red-700/80">
          Verwijdert dit gerecht en alle foto&apos;s/tags.
        </p>
        <button className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
          Verwijder gerecht
        </button>
      </form>
    </div>
  );
}
