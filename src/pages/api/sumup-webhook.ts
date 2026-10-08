import type { APIContext } from "astro";
import { getDB, json } from "../../lib/db";

export const prerender = false;

// SumUp appelle cette URL quand un paiement change d'etat.
// Configurez l'URL dans le dashboard SumUp : https://<votre-domaine>/api/sumup-webhook
export async function POST(ctx: APIContext) {
  let db: D1Database;
  try { db = getDB(ctx.locals); } catch { return json({ ok: false }, 503); }

  let ev: any;
  try { ev = await ctx.request.json(); } catch { return new Response("bad", { status: 400 }); }

  // Formats possibles selon la source ; on cherche une reference + un statut "payé".
  const ref = ev?.checkout_reference || ev?.payload?.checkout_reference || ev?.reference || ev?.id;
  const statut = String(ev?.status || ev?.payload?.status || ev?.event_type || "").toUpperCase();
  const paye = statut.includes("PAID") || statut.includes("SUCCESS") || statut.includes("SUCCEED");

  if (ref && paye) {
    try {
      await db.prepare(`UPDATE adherents SET statut='paye', moyen='sumup_en_ligne' WHERE sumup_ref=?`)
        .bind(String(ref)).run();
    } catch (_) {}
  }
  return json({ ok: true });
}
