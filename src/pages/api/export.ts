import type { APIContext } from "astro";
import { getDB, adminAutorise } from "../../lib/db";

export const prerender = false;

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(ctx: APIContext) {
  if (!adminAutorise(ctx.request, ctx.locals)) return new Response("Non autorisé", { status: 401 });
  const db = getDB(ctx.locals);
  const url = new URL(ctx.request.url);
  const saison = url.searchParams.get("saison");
  const q = saison
    ? db.prepare(`SELECT * FROM adherents WHERE saison=? ORDER BY nom, prenom`).bind(saison)
    : db.prepare(`SELECT * FROM adherents ORDER BY saison DESC, nom, prenom`);
  const { results } = await q.all<any>();
  const cols = ["id","cree_le","saison","prenom","nom","email","telephone","adresse","code_postal","ville","montant_eur","statut","moyen","newsletter","benevole","note"];
  const lignes = [cols.join(";")];
  for (const r of results) lignes.push(cols.map(c => csvCell(r[c])).join(";"));
  const csv = "﻿" + lignes.join("\r\n"); // BOM pour Excel
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="adherents-le-tinal${saison ? "-" + saison : ""}.csv"`,
    },
  });
}
