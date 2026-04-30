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

  const related = await getRelatedDishes(dish, lat, lon, 4);
  const main = dish.images.find((i) => i.isMain) ?? dish.images[0];

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <TrackView entityType="dish" entityId={dish.id} />

      {/* Hero with warm gradient background */}
      {main && (
        <div className="relative mx-auto max-w-lg px-5 pt-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50">
            <div className="relative aspect-square w-full p-6 sm:p-8">
              <Image
                src={main.imageUrl}
                alt={dish.name}
                fill
                className="object-cover p-4 drop-shadow-xl sm:p-6"
                priority
                sizes="(max-width: 640px) 80vw, 400px"
                style={{ borderRadius: "1.5rem" }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-12 sm:px-6">
        {/* Restaurant badge */}
        <div className="mt-4 flex justify-center">
          <Link
            href={`/restaurant/${dish.restaurantId}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-light)] text-xs font-bold text-[var(--accent)]">
              {dish.restaurant.name.charAt(0)}
            </span>
            <span className="text-sm font-medium text-[var(--text)]">{dish.restaurant.name}</span>
          </Link>
        </div>

        {/* Main info */}
        <div className="mt-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            {dish.name}
          </h1>
          {dish.description && (
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
              {dish.description}
            </p>
          )}
        </div>

        {/* Info row */}
        <div className="mt-5 flex items-center justify-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-semibold text-[var(--text)]">4.7</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>
              {dish.distanceKm < 1
                ? `${Math.round(dish.distanceKm * 1000)}m`
                : `${dish.distanceKm.toFixed(1)}km`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            <span>{dish.category.name}</span>
          </div>
        </div>

        {/* Tags */}
        {dish.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {dish.tags.map((t) => (
              <span
                key={t.tagId}
                className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent)]"
              >
                {t.tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Price + Actions */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04]">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[var(--text)]">
              €{dish.price.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <ActionButtons
            restaurantId={dish.restaurantId}
            lat={dish.restaurant.latitude}
            lon={dish.restaurant.longitude}
          />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Meer zoals dit</h2>
            <div className="grid grid-cols-2 gap-3">
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
