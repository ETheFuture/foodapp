import Link from "next/link";

export default function MePage() {
  return (
    <div className="mx-auto w-full max-w-md pb-8">
      {/* Orange header */}
      <div className="rounded-b-3xl bg-gradient-to-br from-[var(--accent)] to-orange-500 px-6 pb-8 pt-10 text-center text-white">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-bold">Mijn Profiel</h1>
        <p className="mt-1 text-sm text-white/80">Komt binnenkort</p>
      </div>

      {/* Menu items */}
      <div className="mt-6 space-y-3 px-5">
        <div className="rounded-2xl bg-white p-1 shadow-sm ring-1 ring-black/[0.04]">
          <MenuItem icon="user" label="Persoonlijke info" />
          <div className="mx-4 border-t border-zinc-100" />
          <MenuItem icon="settings" label="Instellingen" />
        </div>

        <div className="rounded-2xl bg-white p-1 shadow-sm ring-1 ring-black/[0.04]">
          <MenuItem icon="star" label="Beoordelingen" />
          <div className="mx-4 border-t border-zinc-100" />
          <MenuItem icon="orders" label="Bestellingen" count="0" />
        </div>

        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/[0.04] transition hover:bg-zinc-50"
        >
          <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" />
          </svg>
          <span className="text-sm font-medium text-[var(--text)]">Terug naar feed</span>
          <svg className="ml-auto h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, count }: { icon: string; label: string; count?: string }) {
  const iconPaths: Record<string, React.ReactNode> = {
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    orders: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 13h4" /></>,
  };

  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        {iconPaths[icon]}
      </svg>
      <span className="flex-1 text-sm font-medium text-[var(--text)]">{label}</span>
      {count !== undefined && (
        <span className="text-sm font-semibold text-zinc-400">{count}</span>
      )}
      <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
