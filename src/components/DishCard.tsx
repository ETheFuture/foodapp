import Image from "next/image";
import Link from "next/link";
import type { DishListItem } from "@/lib/data/dishes";

type Props = { dish: DishListItem; priority?: boolean };

export function DishCard({ dish, priority = false }: Props) {
  const main = dish.images[0];
  const href = `/dish/${dish.id}`;
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md hover:ring-black/[0.08]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {main ? (
          <Image
            src={main.imageUrl}
            alt={dish.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Geen foto
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <p className="text-lg font-semibold leading-tight text-white drop-shadow-sm sm:text-xl">
            {dish.name}
          </p>
          <p className="mt-0.5 text-sm text-white/90">{dish.restaurant.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <p className="text-sm font-medium text-zinc-500">
          {dish.category.name}
        </p>
        <p className="shrink-0 text-base font-semibold text-[var(--text)]">
          €{dish.price.toFixed(2).replace(".", ",")}
        </p>
        <p className="shrink-0 text-xs text-zinc-400 sm:text-sm">
          {dish.distanceKm < 1
            ? `${Math.round(dish.distanceKm * 1000)} m`
            : `${dish.distanceKm.toFixed(1)} km`}
        </p>
      </div>
    </Link>
  );
}
