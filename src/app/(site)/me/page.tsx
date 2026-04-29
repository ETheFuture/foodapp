import Link from "next/link";

export default function MePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
        <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h1 className="mt-4 text-lg font-semibold text-[var(--text)]">Profiel</h1>
      <p className="mt-2 text-sm text-zinc-500">Account en instellingen.</p>
      <p className="mt-1 text-xs text-zinc-400">Komt binnenkort.</p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-[var(--accent)]"
      >
        Terug naar feed
      </Link>
    </div>
  );
}
