import Link from "next/link";

export default function MePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-[var(--text)]">Profiel</h1>
      <p className="mt-3 text-sm text-zinc-500">
        Account- en instellingen komen binnenkort.
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
