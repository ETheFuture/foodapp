"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
          aria-label="Terug naar feed"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200">
            <svg className="h-4 w-4 text-[var(--text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          <span className="text-base font-bold tracking-tight text-[var(--text)]">
            Bite<span className="text-[var(--accent)]">.</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
