"use client";

import Link from "next/link";
import { parseHomeRadiusParam } from "@/lib/home-radius";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition, FormEvent } from "react";

const STEPS = [0.5, 1, 2, 5, 10] as const;
const STEP_LABELS = ["500m", "1km", "2km", "5km", "10km"] as const;

type Props = { defaultQ: string };

function idx(r: number) {
  const i = STEPS.findIndex((x) => Math.abs(x - r) < 0.001);
  return i >= 0 ? i : 1;
}

function url(q: string, km: number) {
  const p = new URLSearchParams();
  if (q.trim()) p.set("q", q.trim());
  if (km !== 1) p.set("radius", String(km));
  const s = p.toString();
  return s ? `/?${s}` : "/";
}

export function HomeBottomBar({ defaultQ }: Props) {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const [pending, go] = useTransition();
  const [q, setQ] = useState(defaultQ);

  const km = parseHomeRadiusParam(sp.get("radius"));
  const si = idx(km);

  useEffect(() => { setQ(sp.get("q")?.trim() ?? ""); }, [sp]);

  const nav = useCallback(
    (nextQ: string, nextKm: number) => {
      go(() => router.push(url(nextQ, nextKm), { scroll: false }));
    },
    [router],
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    nav(q, STEPS[si] ?? 1);
  };

  if (path !== "/") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      {/* Frosted panel */}
      <div className="mx-2 overflow-hidden rounded-3xl border border-white/30 bg-white/80 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:mx-auto sm:max-w-md">
        <div className="px-4 pb-2 pt-3">

          {/* ── Search ── */}
          <form onSubmit={submit}>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-zinc-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden
              >
                <circle cx="10.5" cy="10.5" r="5.5" />
                <path d="M15 15l5.5 5.5" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Zoek gerecht…"
                className="h-10 w-full rounded-full border-0 bg-zinc-100/80 pl-10 pr-20 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/30 focus:outline-hidden"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={pending}
                className="absolute right-1 top-1 h-8 rounded-full bg-[var(--accent)] px-4 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                Zoek
              </button>
            </div>
          </form>

          {/* ── Distance slider ── */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between px-1">
              <span className="text-[11px] font-medium tracking-wide text-zinc-400">
                AFSTAND
              </span>
              <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--accent)]">
                {STEP_LABELS[si]}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={STEPS.length - 1}
              step={1}
              value={si}
              onChange={(e) => nav(q, STEPS[Number(e.target.value)] ?? 1)}
              className="feed-slider h-7 w-full cursor-pointer appearance-none bg-transparent"
            />
            <div className="flex justify-between px-1 text-[9px] font-medium text-zinc-400">
              {STEP_LABELS.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>

          {/* ── Nav ── */}
          <nav className="mt-2 flex items-center justify-around" aria-label="Navigatie">
            <Tab href="/" icon="home" label="Feed" active />
            <Tab href="/search" icon="search" label="Zoek" />
            <Tab href="/map" icon="map" label="Kaart" />
            <Tab href="/favorites" icon="heart" label="Likes" />
            <Tab href="/me" icon="user" label="Profiel" />
          </nav>
        </div>
      </div>
    </div>
  );
}

/* ── Tab icon ── */
function Tab({ href, icon, label, active = false }: {
  href: string; icon: string; label: string; active?: boolean;
}) {
  const c = active ? "text-[var(--accent)]" : "text-zinc-400";
  return (
    <Link href={href} className={`flex flex-col items-center gap-0.5 py-1.5 ${c}`} title={label}>
      <Ico name={icon} active={active} />
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}

function Ico({ name, active }: { name: string; active: boolean }) {
  const s = active ? "var(--accent)" : "currentColor";
  const p: Record<string, string> = {
    home: "M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z",
    map: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z",
    heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
  };
  if (name === "search")
    return (
      <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={1.7} aria-hidden>
        <circle cx="10.5" cy="10.5" r="5.5" /><path d="M15 15l6 6" />
      </svg>
    );
  if (name === "user")
    return (
      <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={1.7} aria-hidden>
        <path d={p.user!} /><circle cx="12" cy="7" r="4" />
      </svg>
    );
  if (name === "map")
    return (
      <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={1.7} aria-hidden>
        <path d={p.map!} /><circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  return (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={1.7} aria-hidden>
      <path d={p[name]!} />
    </svg>
  );
}
