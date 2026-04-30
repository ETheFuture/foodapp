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
      <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        {main ? (
          <Image
            src={main.imageUrl}
            alt={dish.name}
            fill
            className="object-cover p-3 drop-shadow-md transition duration-300 group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            style={{ borderRadius: "1rem" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            Geen foto
          </div>
        )}
      </div>
      <div className="px-3 pb-3 pt-2">
        <p className="line-clamp-1 text-sm font-bold text-[var(--text)]">
          {dish.name}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
          {dish.restaurant.name}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--text)]">
            €{dish.price.toFixed(0)}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-sm transition group-hover:scale-110">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
