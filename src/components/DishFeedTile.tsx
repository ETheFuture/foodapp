import Image from "next/image";
import Link from "next/link";
import type { DishListItem } from "@/lib/data/dishes";

type Props = { dish: DishListItem; priority?: boolean };

export function DishFeedTile({ dish, priority = false }: Props) {
  const main = dish.images[0];

  return (
    <Link
      href={`/dish/${dish.id}`}
      className="group relative block aspect-square overflow-hidden rounded-2xl bg-zinc-100 shadow-sm ring-1 ring-black/[0.04]"
    >
      {main ? (
        <Image
          src={main.imageUrl}
          alt={dish.name}
          fill
          loading="eager"
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 28vw, 20vw"
          priority={priority}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-[11px] text-zinc-400">
          Geen foto
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
        <p className="line-clamp-1 text-[12px] font-bold leading-snug text-white drop-shadow sm:text-[13px]">
          {dish.name}
        </p>
        <div className="mt-0.5 flex items-center justify-between">
          <p className="line-clamp-1 text-[10px] text-white/70 sm:text-[11px]">
            {dish.restaurant.name}
          </p>
          <span className="shrink-0 rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-white">
            €{dish.price.toFixed(0)}
          </span>
        </div>
      </div>
    </Link>
  );
}
