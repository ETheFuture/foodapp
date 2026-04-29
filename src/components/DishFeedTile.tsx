import Image from "next/image";
import Link from "next/link";
import type { DishListItem } from "@/lib/data/dishes";

type Props = { dish: DishListItem; priority?: boolean };

/**
 * Vierkante tegel in een 3-koloms grid (Instagram-achtig).
 */
export function DishFeedTile({ dish, priority = false }: Props) {
  const main = dish.images[0];
  const href = `/dish/${dish.id}`;

  return (
    <Link
      href={href}
      className="group relative block aspect-square overflow-hidden bg-zinc-100"
    >
      {main ? (
        <Image
          src={main.imageUrl}
          alt={dish.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, 20vw"
          priority={priority}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-zinc-400">
          Geen foto
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2">
        <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-white drop-shadow sm:text-xs">
          {dish.name}
        </p>
        <p className="mt-0.5 text-[10px] text-white/80 sm:text-[11px]">
          {dish.distanceKm < 1
            ? `${Math.round(dish.distanceKm * 1000)} m`
            : `${dish.distanceKm.toFixed(1)} km`}
        </p>
      </div>
    </Link>
  );
}
