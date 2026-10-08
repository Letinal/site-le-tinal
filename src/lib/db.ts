// Helpers partages cote serveur (Cloudflare runtime).
export function env(locals: any): any {
  return locals?.runtime?.env ?? {};
}
export function getDB(locals: any): D1Database {
  const e = env(locals);
  if (!e.DB) throw new Error("Base D1 non configurée (binding DB manquant).");
  return e.DB as D1Database;
}
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
export function saison(e: any): string {
  return String(e.SAISON_ANNEE || new Date().getFullYear());
}
export function cotisation(e: any): number {
  return Number(e.COTISATION_EUR || 10);
}
// Verifie le jeton admin (en-tete Authorization: Bearer, ou ?token=, ou cookie).
export function adminAutorise(request: Request, locals: any): boolean {
  const attendu = env(locals).ADMIN_TOKEN;
  if (!attendu) return false;
  const url = new URL(request.url);
  const auth = request.headers.get("Authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const q = url.searchParams.get("token") || "";
  const cookie = (request.headers.get("Cookie") || "").match(/(?:^|;\s*)tinal_admin=([^;]+)/)?.[1] || "";
  const fourni = bearer || q || decodeURIComponent(cookie);
  return fourni.length > 0 && fourni === attendu;
}
