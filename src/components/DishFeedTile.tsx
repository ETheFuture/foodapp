import Image from "next/image";
import Link from "next/link";
import type { DishListItem } from "@/lib/data/dishes";

type Props = { dish: DishListItem; priority?: boolean };

export function DishFeedTile({ dish, priority = false }: Props) {
  const main = dish.images[0];
  const href = `/dish/${dish.id}`;

  return (
    <Link href={href} className="group relative block aspect-square overflow-hidden">
      {main ? (
        <Image
          src={main.imageUrl}
          alt={dish.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 33vw, 25vw"
          priority={priority}
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-zinc-100 text-xs text-zinc-400">
          Geen foto
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 px-2 pb-2 pt-6">
        <p className="line-clamp-1 text-[13px] font-semibold leading-tight text-white drop-shadow-sm">
          {dish.name}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-white/75">
          €{dish.price.toFixed(0)} · {dish.distanceKm < 1
            ? `${Math.round(dish.distanceKm * 1000)}m`
            : `${dish.distanceKm.toFixed(1)}km`}
        </p>
      </div>
    </Link>
  );
}
