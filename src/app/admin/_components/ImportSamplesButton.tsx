"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { importSampleDishesAction } from "../actions";

export function ImportSamplesButton() {
  const r = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setMsg(null);
            try {
              const res = await importSampleDishesAction();
              setMsg(`✓ ${res.created} gerechten toegevoegd`);
              r.refresh();
            } catch (e) {
              setMsg(e instanceof Error ? e.message : "Import faalde");
            }
          })
        }
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Bezig…" : "+ Voeg 50 voorbeeldgerechten toe"}
      </button>
      {msg && <p className="text-xs text-zinc-500">{msg}</p>}
    </div>
  );
}
