/**
 * Fails fast with a clear message if DATABASE_URL is missing.
 * Vercel: add DATABASE_URL in Project → Settings → Environment Variables
 * (enable for Production and Preview; builds need it).
 */
if (!process.env.DATABASE_URL || String(process.env.DATABASE_URL).trim() === "") {
  console.error("");
  console.error("══════════════════════════════════════════════════════════════");
  console.error("  BUILD FOUT: DATABASE_URL ontbreekt");
  console.error("══════════════════════════════════════════════════════════════");
  console.error("");
  console.error("  1. Open Vercel → jouw project → Settings → Environment Variables");
  console.error("  2. Voeg DATABASE_URL toe (PostgreSQL connection string van Neon,");
  console.error("     Supabase of Vercel Postgres), vaak eindigend op ?sslmode=require");
  console.error("  3. Vink minstens 'Production' en 'Preview' aan (build gebruikt ze).");
  console.error("  4. Redeploy.");
  console.error("");
  process.exit(1);
}
