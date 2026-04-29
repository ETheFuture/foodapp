import Image from "next/image";
import Link from "next/link";
import type { DishListItem } from "@/lib/data/dishes";

type Props = { dish: DishListItem; priority?: boolean };

export function DishFeedTile({ dish, priority = false }: Props) {
  const main = dish.images[0];

  return (
    <Link
      href={`/dish/${dish.id}`}
      className="group relative block aspect-square overflow-hidden rounded-xl bg-[#2c2c2e]"
    >
      {main ? (
        <Image
          src={main.imageUrl}
          alt={dish.name}
          fill
          loading={priority ? "eager" : "eager"}
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 28vw, 20vw"
          priority={priority}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-[11px] text-zinc-500">
          Geen foto
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5">
        <p className="line-clamp-1 text-[12px] font-semibold leading-snug text-white drop-shadow sm:text-[13px]">
          {dish.name}
        </p>
      </div>
    </Link>
  );
}
