import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-light)]">
        <svg className="h-9 w-9 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <h1 className="mt-5 text-xl font-bold text-[var(--text)]">Favorieten</h1>
      <p className="mt-2 text-sm text-zinc-500">Bewaar gerechten die je aanspreken.</p>
      <p className="mt-1 text-xs text-zinc-400">Komt binnenkort.</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:opacity-90"
      >
        Terug naar feed
      </Link>
    </div>
  );
}
