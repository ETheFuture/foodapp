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
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {main ? (
          <Image
            src={main.imageUrl}
            alt={dish.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Geen foto
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-base font-semibold leading-tight text-white drop-shadow-sm">
            {dish.name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-sm text-zinc-500">{dish.restaurant.name}</span>
        <span className="text-sm font-semibold text-[var(--text)]">
          €{dish.price.toFixed(0)}
        </span>
      </div>
    </Link>
  );
}
