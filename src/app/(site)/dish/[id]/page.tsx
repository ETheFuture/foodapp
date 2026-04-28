import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { getDishListItemById, getRelatedDishes } from "@/lib/data/dishes";
import { TrackView } from "@/components/TrackView";
import { DishCard } from "@/components/DishCard";
import { ActionButtons } from "@/components/ActionButtons";

type PageProps = { params: Promise<{ id: string }> };

export default async function DishPage({ params }: PageProps) {
  const { id } = await params;
  const { lat, lon } = AMSTERDAM_DEFAULT;
  const dish = await getDishListItemById(id, lat, lon);
  if (!dish) notFound();

  const related = await getRelatedDishes(dish, lat, lon, 6);
  const main = dish.images.find((i) => i.isMain) ?? dish.images[0];
  const rest = dish.images.filter((i) => i.id !== main?.id);

  return (
    <div>
      <TrackView entityType="dish" entityId={dish.id} />
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-3 text-sm text-zinc-500">
          <Link href="/search" className="hover:text-zinc-800">
            ← Zoeken
          </Link>{" "}
          · {dish.category.name}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {main && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm ring-1 ring-black/5">
                <Image
                  src={main.imageUrl}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            )}
            {rest.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {rest.slice(0, 3).map((im) => (
                  <div
                    key={im.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    <Image
                      src={im.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              {dish.name}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              €{dish.price.toFixed(2).replace(".", ",")}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {dish.distanceKm < 1
                ? `${Math.round(dish.distanceKm * 1000)} m`
                : `${dish.distanceKm.toFixed(1)} km`}{" "}
              vanaf {dish.restaurant.name}
            </p>
            {dish.description && (
              <p className="mt-6 text-base leading-relaxed text-zinc-600">
                {dish.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {dish.tags.map((t) => (
                <span
                  key={t.tagId}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                >
                  {t.tag.name}
                </span>
              ))}
            </div>
            <ActionButtons
              restaurantId={dish.restaurantId}
              lat={dish.restaurant.latitude}
              lon={dish.restaurant.longitude}
            />
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
              <p className="text-sm font-medium text-zinc-500">Restaurant</p>
              <Link
                href={`/restaurant/${dish.restaurantId}`}
                className="mt-1 text-lg font-semibold text-zinc-900 hover:underline"
              >
                {dish.restaurant.name}
              </Link>
              <p className="mt-1 text-sm text-zinc-600">
                {dish.restaurant.address}
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12 border-t border-zinc-200 pt-10">
            <h2 className="text-xl font-semibold text-zinc-900">Vergelijkbaar</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d) => (
                <DishCard key={d.id} dish={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
