export const prerender = false;
import prog from '../../data/programme.json';

const DEFAULT_CODE = 'sushicesoir20h!';
const KEY = 'events';
const MAX_IMG = 320000; // ~320 Ko max pour une mini-image (base64)

function getEnv(locals: any) { return (locals && locals.runtime && locals.runtime.env) || {}; }
function json(data: any, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } }); }
function bad(status: number, msg: string) { return json({ ok: false, error: msg }, status); }

function slug(s: string) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28); }
function rid() { return Math.random().toString(36).slice(2, 8); }
function imgNorm(im: string) {
  if (!im) return '';
  if (im.indexOf('data:') === 0 || im.charAt(0) === '/') return im;
  return '/photos/events/' + im;
}
function normalize(e: any) {
  return {
    id: e.id || (e.date || '') + '-' + slug(e.titre) + '-' + rid(),
    date: String(e.date || '').slice(0, 10),
    heure: String(e.heure || '').slice(0, 20),
    type: String(e.type || '').slice(0, 40),
    titre: String(e.titre || '').slice(0, 120),
    lieu: String(e.lieu || '').slice(0, 80),
    description: String(e.description || '').slice(0, 1000),
    gratuit: !!e.gratuit,
    prix: String(e.prix || '').slice(0, 40),
    image: imgNorm(String(e.image || '')),
  };
}
function seed() { return (prog.evenements || []).map(normalize); }

async function read(kv: any) { if (!kv) return null; return await kv.get(KEY, 'json'); }
async function write(kv: any, events: any) { if (kv) await kv.put(KEY, JSON.stringify(events)); }

export async function GET({ locals }: any) {
  const kv = getEnv(locals).BENEVOLES;
  let events = await read(kv);
  if (!events) events = seed();
  return json({ ok: true, events });
}

export async function POST({ locals, request }: any) {
  const env = getEnv(locals);
  const kv = env.BENEVOLES;
  let b: any = {};
  try { b = await request.json(); } catch (e) {}
  if ((b.code || '') !== (env.CODE_BUREAU || DEFAULT_CODE)) return bad(401, 'code');

  let events = (await read(kv)) || seed();

  if (b.action === 'reset') {
    events = seed();
  } else if (b.action === 'upsert') {
    const ev = normalize(b.event || {});
    if (!ev.date || !ev.titre) return bad(400, 'La date et le titre sont obligatoires.');
    if (ev.image && ev.image.indexOf('data:') === 0 && ev.image.length > MAX_IMG) return bad(400, 'Image trop lourde.');
    const keepId = (b.event && b.event.id) ? String(b.event.id) : '';
    if (keepId) ev.id = keepId;
    const i = events.findIndex((x: any) => x.id === ev.id);
    if (i >= 0) events[i] = ev; else events.push(ev);
  } else if (b.action === 'delete') {
    const id = String(b.id || '');
    events = events.filter((x: any) => x.id !== id);
  } else {
    return bad(400, 'action');
  }

  events.sort((a: any, b2: any) => a.date.localeCompare(b2.date));
  await write(kv, events);
  return json({ ok: true, events });
}
