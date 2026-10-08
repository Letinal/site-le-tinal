import type { APIContext } from "astro";
import { getDB, json, adminAutorise } from "../../lib/db";

export const prerender = false;

// Met a jour le statut/moyen d'un adherent depuis l'espace admin (pointage manuel).
export async function POST(ctx: APIContext) {
  if (!adminAutorise(ctx.request, ctx.locals)) return json({ error: "Non autorisé" }, 401);
  let db: D1Database;
  try { db = getDB(ctx.locals); } catch { return json({ error: "Base non configurée" }, 503); }
  let b: any;
  try { b = await ctx.request.json(); } catch { return json({ error: "Requête invalide" }, 400); }
  const id = Number(b.id);
  const statut = String(b.statut || "");
  if (!id || !["a_regler", "paye", "annule"].includes(statut)) {
    return json({ error: "Paramètres invalides" }, 400);
  }
  const moyen = b.moyen ? String(b.moyen).slice(0, 30) : null;
  await db.prepare(`UPDATE adherents SET statut=?, moyen=COALESCE(?, moyen) WHERE id=?`)
    .bind(statut, moyen, id).run();
  return json({ ok: true });
}
