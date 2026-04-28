import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function maskUrl(u: string | undefined): string {
  if (!u) return "(missing)";
  try {
    const url = new URL(u);
    const userInfo = url.username ? `${url.username}:***@` : "";
    return `${url.protocol}//${userInfo}${url.host}${url.pathname}`;
  } catch {
    return "(invalid url)";
  }
}

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  const result: Record<string, unknown> = {
    ok: false,
    env: {
      DATABASE_URL_present: Boolean(databaseUrl),
      DATABASE_URL_preview: maskUrl(databaseUrl),
      AUTH_SECRET_present: Boolean(process.env.AUTH_SECRET),
      AUTH_SECRET_long_enough: (process.env.AUTH_SECRET ?? "").length >= 16,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
  };
  if (!databaseUrl) {
    result.error = "DATABASE_URL ontbreekt in env vars op Vercel.";
    return NextResponse.json(result, { status: 500 });
  }
  try {
    const [restaurants, dishes, categories] = await Promise.all([
      prisma.restaurant.count(),
      prisma.dish.count(),
      prisma.category.count(),
    ]);
    result.ok = true;
    result.counts = { restaurants, dishes, categories };
    if (dishes === 0) {
      result.note =
        "Verbinding werkt, maar de tabellen zijn leeg. Run de seed: npx prisma db seed (met productie DATABASE_URL).";
    }
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    result.error = msg;
    if (msg.includes("does not exist")) {
      result.hint =
        "De tabellen bestaan niet. Run: npx prisma migrate deploy met productie DATABASE_URL.";
    } else if (msg.includes("P1001") || msg.toLowerCase().includes("can't reach")) {
      result.hint =
        "DATABASE_URL is ingesteld maar de DB is onbereikbaar. Controleer host/poort/sslmode (Neon: ?sslmode=require).";
    } else if (msg.toLowerCase().includes("authentication") || msg.includes("P1000")) {
      result.hint =
        "Verkeerd wachtwoord/gebruiker in DATABASE_URL.";
    }
    return NextResponse.json(result, { status: 500 });
  }
}
