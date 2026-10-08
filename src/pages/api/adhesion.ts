import type { APIContext } from "astro";
import { getDB, env, json } from "../../lib/db";
import { creerPaiement } from "../../lib/sumup";
import site from "../../data/site.json";

export const prerender = false;

function propre(s: unknown, max = 200): string {
  return String(s ?? "").trim().slice(0, max);
}

export async function POST(ctx: APIContext) {
  const e = env(ctx.locals);
  let db: D1Database;
  try { db = getDB(ctx.locals); }
  catch { return json({ error: "Service indisponible (base non configurée)." }, 503); }

  let body: any;
  try { body = await ctx.request.json(); }
  catch { return json({ error: "Requête invalide." }, 400); }

  const prenom = propre(body.prenom, 80);
  const nom = propre(body.nom, 80);
  const email = propre(body.email, 160).toLowerCase();
  if (!prenom || !nom || !email || !email.includes("@")) {
    return json({ error: "Merci de renseigner prénom, nom et un e-mail valide." }, 400);
  }
  if (!body.rgpd) {
    return json({ error: "Merci d'accepter l'utilisation de vos données (RGPD)." }, 400);
  }

  const saison = String(e.SAISON_ANNEE || site.saisonAnnee || new Date().getFullYear());
  const montant = Number(e.COTISATION_EUR || site.cotisationEur || 10);
  const reference = `adh-${saison}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const champs = {
    saison,
    prenom, nom, email,
    telephone: propre(body.telephone, 40),
    adresse: propre(body.adresse, 200),
    code_postal: propre(body.code_postal, 12),
    ville: propre(body.ville, 100),
    montant,
    newsletter: body.newsletter ? 1 : 0,
    benevole: body.benevole ? 1 : 0,
    sumup_ref: reference,
  };

  try {
    await db.prepare(
      `INSERT INTO adherents
        (saison, prenom, nom, email, telephone, adresse, code_postal, ville, montant_eur, statut, moyen, sumup_ref, newsletter, benevole)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'a_regler', 'en_attente', ?, ?, ?)
       ON CONFLICT(saison, email) DO UPDATE SET
        prenom=excluded.prenom, nom=excluded.nom, telephone=excluded.telephone,
        adresse=excluded.adresse, code_postal=excluded.code_postal, ville=excluded.ville,
        sumup_ref=excluded.sumup_ref, newsletter=excluded.newsletter, benevole=excluded.benevole`
    ).bind(
      champs.saison, champs.prenom, champs.nom, champs.email, champs.telephone,
      champs.adresse, champs.code_postal, champs.ville, champs.montant,
      champs.sumup_ref, champs.newsletter, champs.benevole
    ).run();
  } catch (err: any) {
    return json({ error: "Impossible d'enregistrer l'adhésion pour le moment." }, 500);
  }

  const origin = new URL(ctx.request.url).origin;
  const paiement = await creerPaiement({
    env: e,
    reference,
    montant,
    description: `Adhésion ${site.nom} ${saison}`,
    returnUrl: `${origin}/merci?statut=paye`,
    email,
  });

  try {
    await db.prepare(`UPDATE adherents SET moyen=?, sumup_ref=? WHERE saison=? AND email=?`)
      .bind(paiement.moyen, paiement.ref, saison, email).run();
  } catch (_) {}

  return json({ ok: true, checkoutUrl: paiement.checkoutUrl });
}
