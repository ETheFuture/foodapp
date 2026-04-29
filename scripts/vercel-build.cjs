/**
 * Vercel build:
 * - Zonder DATABASE_URL: build lukt (placeholder alleen voor prisma generate), geen migrate/seed.
 * - Met DATABASE_URL: migrate → seed (50 gerechten als leeg) → next build.
 */
const { execSync } = require("child_process");

const PLACEHOLDER =
  "postgresql://prisma:prisma@127.0.0.1:5432/_prisma_build?schema=public";

function run(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const raw = process.env.DATABASE_URL;
const hasDatabaseUrl = raw && String(raw).trim().length > 0;

if (!hasDatabaseUrl) {
  process.env.DATABASE_URL = PLACEHOLDER;
  console.log("");
  console.log(
    "[build] Geen DATABASE_URL: Prisma client wordt gegenereerd; migrate/seed worden overgeslagen.",
  );
  console.log(
    "        Voeg in Vercel → Settings → Environment Variables toe: DATABASE_URL (Postgres, vaak ?sslmode=require),",
  );
  console.log(
    "        vink Production + Preview, Redeploy — daarna staan tabellen + 50 voorbeeldgerechten.",
  );
  console.log("");
}

run("npx prisma generate");

if (hasDatabaseUrl) {
  run("npx prisma migrate deploy");
  try {
    execSync("npx prisma db seed", { stdio: "inherit", env: process.env });
  } catch (e) {
    console.log("[build] Seed failed (non-fatal) — site builds without seed data.");
    console.log("[build] Seed error:", e.message || e);
  }
} else {
  console.log("[build] Overgeslagen: prisma migrate deploy && prisma db seed");
}

run("npx next build");
