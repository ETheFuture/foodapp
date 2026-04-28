import Link from "next/link";
import { readSession } from "@/lib/auth";

export async function Header() {
  const s = await readSession();
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--text)]"
        >
          Bite
          <span className="text-[var(--accent)]">.</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3 text-sm">
          <Link
            href="/search"
            className="rounded-full px-3 py-1.5 text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            Ontdekken
          </Link>
          <Link
            href="/map"
            className="rounded-full px-3 py-1.5 text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            Kaart
          </Link>
          {s?.role === "RESTAURANT" && (
            <Link
              href="/dashboard"
              className="rounded-full px-3 py-1.5 font-medium text-[var(--accent)] transition hover:opacity-80"
            >
              Dashboard
            </Link>
          )}
          {s?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="rounded-full px-3 py-1.5 font-medium text-[var(--accent)] transition hover:opacity-80"
            >
              Beheer
            </Link>
          )}
          {!s && (
            <Link
              href="/login"
              className="rounded-full bg-[var(--text)] px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Inloggen
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
