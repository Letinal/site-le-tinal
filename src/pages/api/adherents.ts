import type { APIContext } from "astro";
import { getDB, json, adminAutorise } from "../../lib/db";

export const prerender = false;

export async function GET(ctx: APIContext) {
  if (!adminAutorise(ctx.request, ctx.locals)) return json({ error: "Non autorisé" }, 401);
  let db: D1Database;
  try { db = getDB(ctx.locals); } catch { return json({ error: "Base non configurée" }, 503); }
  const url = new URL(ctx.request.url);
  const saison = url.searchParams.get("saison");
  const q = saison
    ? db.prepare(`SELECT * FROM adherents WHERE saison=? ORDER BY cree_le DESC`).bind(saison)
    : db.prepare(`SELECT * FROM adherents ORDER BY cree_le DESC`);
  const { results } = await q.all();
  return json({ ok: true, adherents: results });
}
