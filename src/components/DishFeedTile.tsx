import Image from "next/image";
import Link from "next/link";
import type { DishListItem } from "@/lib/data/dishes";

type Props = { dish: DishListItem; priority?: boolean };

export function DishFeedTile({ dish, priority = false }: Props) {
  const main = dish.images[0];

  return (
    <Link
      href={`/dish/${dish.id}`}
      className="group relative block aspect-square overflow-hidden rounded-2xl bg-zinc-100"
    >
      {main ? (
        <Image
          src={main.imageUrl}
          alt={dish.name}
          fill
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 32vw, (max-width: 1024px) 28vw, 20vw"
          priority={priority}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-zinc-300">
          Geen foto
        </div>
      )}

      {/* Gradient overlay — only at the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        aria-hidden
      />

      {/* Text label */}
      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
        <p className="line-clamp-1 text-[13px] font-semibold leading-snug text-white drop-shadow-md sm:text-sm">
          {dish.name}
        </p>
        <p className="mt-0.5 text-[11px] text-white/70 sm:text-xs">
          €{dish.price.toFixed(0)}
        </p>
      </div>
    </Link>
  );
}
