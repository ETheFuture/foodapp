"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-2xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
          aria-label="Terug naar feed"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-base font-semibold tracking-tight text-[var(--text)]">
            Bite<span className="text-[var(--accent)]">.</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
