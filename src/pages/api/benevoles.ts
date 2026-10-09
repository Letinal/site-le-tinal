export const prerender = false;

const DEFAULT_CODE = '511590';
const KEY = 'signups';

function getEnv(locals: any) { return (locals && locals.runtime && locals.runtime.env) || {}; }
async function readData(kv: any) { if (!kv) return {}; return (await kv.get(KEY, 'json')) || {}; }
async function writeData(kv: any, data: any) { if (kv) await kv.put(KEY, JSON.stringify(data)); }
function ok(data: any) { return new Response(JSON.stringify({ ok: true, data }), { headers: { 'content-type': 'application/json' } }); }
function bad(status: number, msg: string) { return new Response(JSON.stringify({ ok: false, error: msg }), { status, headers: { 'content-type': 'application/json' } }); }

export async function GET({ locals, url }: any) {
  const env = getEnv(locals);
  const code = url.searchParams.get('code') || '';
  if (code !== (env.CODE_BENEVOLES || DEFAULT_CODE)) return bad(401, 'code');
  const data = await readData(env.BENEVOLES);
  return ok(data);
}

export async function POST({ locals, request }: any) {
  const env = getEnv(locals);
  let body: any = {};
  try { body = await request.json(); } catch (e) {}
  if ((body.code || '') !== (env.CODE_BENEVOLES || DEFAULT_CODE)) return bad(401, 'code');
  const kv = env.BENEVOLES;
  const data = await readData(kv);
  const date = String(body.date || '').slice(0, 10);
  const name = String(body.name || '').trim().slice(0, 40);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad(400, 'date');
  if (body.action === 'add') {
    if (!name) return bad(400, 'name');
    data[date] = data[date] || [];
    if (!data[date].some((x: string) => x.toLowerCase() === name.toLowerCase())) data[date].push(name);
  } else if (body.action === 'remove') {
    data[date] = (data[date] || []).filter((x: string) => x.toLowerCase() !== name.toLowerCase());
    if (data[date].length === 0) delete data[date];
  } else {
    return bad(400, 'action');
  }
  await writeData(kv, data);
  return ok(data);
}
