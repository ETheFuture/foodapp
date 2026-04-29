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

      {/* Hero image — edge to edge on mobile */}
      {main && (
        <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[16/10] sm:max-h-[60vh]">
          <Image
            src={main.imageUrl}
            alt={dish.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-12 sm:px-6">
        {/* Main info */}
        <div className={main ? "-mt-16" : "pt-4"}>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            {dish.name}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
            <span className="text-lg font-semibold text-[var(--text)]">
              €{dish.price.toFixed(2).replace(".", ",")}
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-300" aria-hidden />
            <span>
              {dish.distanceKm < 1
                ? `${Math.round(dish.distanceKm * 1000)}m`
                : `${dish.distanceKm.toFixed(1)}km`}
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-300" aria-hidden />
            <span>{dish.category.name}</span>
          </div>
        </div>

        {/* Tags */}
        {dish.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {dish.tags.map((t) => (
              <span
                key={t.tagId}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
              >
                {t.tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {dish.description && (
          <p className="mt-5 text-[15px] leading-relaxed text-zinc-600">
            {dish.description}
          </p>
        )}

        {/* Action buttons */}
        <ActionButtons
          restaurantId={dish.restaurantId}
          lat={dish.restaurant.latitude}
          lon={dish.restaurant.longitude}
        />

        {/* Restaurant card */}
        <Link
          href={`/restaurant/${dish.restaurantId}`}
          className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600">
            {dish.restaurant.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text)]">{dish.restaurant.name}</p>
            <p className="truncate text-xs text-zinc-500">{dish.restaurant.address}</p>
          </div>
          <svg className="ml-auto h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">Meer zoals dit</h2>
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
