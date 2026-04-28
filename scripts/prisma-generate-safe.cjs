/**
 * Prisma leest env("DATABASE_URL") uit het schema; zonder variabele faalt zelfs `generate`.
 * Voor install/build zonder echte database zetten we een syntactisch geldige placeholder
 * (er wordt geen connectie gemaakt tijdens generate).
 */
const { execSync } = require("child_process");
const PLACEHOLDER =
  "postgresql://prisma:prisma@127.0.0.1:5432/_prisma_generate?schema=public";
if (!process.env.DATABASE_URL || !String(process.env.DATABASE_URL).trim()) {
  process.env.DATABASE_URL = PLACEHOLDER;
}
execSync("npx prisma generate", { stdio: "inherit", env: process.env });
