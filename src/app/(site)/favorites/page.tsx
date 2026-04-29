import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-[var(--text)]">Favorieten</h1>
      <p className="mt-3 text-sm text-zinc-500">
        Hier komen binnenkort bewaarde gerechten.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-[var(--accent)]"
      >
        Terug naar feed
      </Link>
    </div>
  );
}
