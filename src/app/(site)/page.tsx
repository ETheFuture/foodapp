import Image from "next/image";
import Link from "next/link";
import { AMSTERDAM_DEFAULT } from "@/lib/geo";
import { getHomeDishes, getCategories } from "@/lib/data/dishes";
import { DishCard } from "@/components/DishCard";
import { HomeSearch } from "@/components/HomeSearch";

const heroImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=85";

type HomeData = Awaited<ReturnType<typeof getHomeDishes>>;
type Category = { id: string; name: string };

async function safeLoad(): Promise<{
  data: HomeData | null;
  categories: Category[];
  dbError: string | null;
}> {
  const { lat, lon } = AMSTERDAM_DEFAULT;
  try {
    const [data, categories] = await Promise.all([
      getHomeDishes(lat, lon),
      getCategories(),
    ]);
    return { data, categories, dbError: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Onbekende databasefout";
    console.error("[home] data load failed:", msg);
    return { data: null, categories: [], dbError: msg };
  }
}

export default async function HomePage() {
  const { data, categories, dbError } = await safeLoad();

  return (
    <div className="min-h-full">
      <section className="relative min-h-[78vh] overflow-hidden">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[var(--bg)]" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-16 pt-32 sm:px-6 sm:pb-20">
          <div className="mx-auto w-full max-w-2xl text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/90">
              Dish-first · Amsterdam
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
              Waar heb je zin in?
            </h1>
            <p className="mt-4 text-lg text-white/85 sm:text-xl">
              Ontdek gerechten, niet adressen. Eén klik naar trek en route.
            </p>
            <div className="mt-8">
              <HomeSearch />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-14 px-4 py-12 sm:px-6 sm:py-16">
        {dbError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-medium">Geen verbinding met de database.</p>
            <p className="mt-1 opacity-80">
              De UI werkt, maar er is geen content. Controleer{" "}
              <code className="rounded bg-white/70 px-1">DATABASE_URL</code> in
              Vercel en draai{" "}
              <code className="rounded bg-white/70 px-1">prisma migrate deploy</code>{" "}
              + seed.
            </p>
          </div>
        )}

        {categories.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Categorieën
              </h2>
              <Link
                href="/search"
                className="text-sm font-medium text-[var(--accent)]"
              >
                Alles
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/search?categoryId=${c.id}`}
                  className="rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {data && data.featured.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Uitgelicht
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Selectie van onze keuken.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.featured.map((d, i) => (
                <DishCard key={d.id} dish={d} priority={i < 3} />
              ))}
            </div>
          </section>
        )}

        {data && data.popular.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Populair
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Recent toegevoegd met veel views.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.popular.map((d) => (
                <DishCard key={d.id} dish={d} />
              ))}
            </div>
          </section>
        )}

        {data && data.nearYou.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Bij jou in de buurt
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Gesorteerd op afstand vanaf Amsterdam centrum.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.nearYou.map((d) => (
                <DishCard key={d.id} dish={d} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
