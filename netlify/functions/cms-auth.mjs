/**
 * Connexion à l'admin par identifiant + mot de passe.
 *
 * Variables d'environnement (Netlify → Site configuration → Environment variables) :
 *   CMS_USERS     liste « identifiant:sel:hash » séparés par des virgules
 *                 (générer avec `npm run hash-password`)
 *   GITHUB_TOKEN  jeton GitHub « fine-grained » limité au dépôt du site
 *                 (permissions : Contents = Read and write, Metadata = Read)
 *
 * POST /api/cms-auth  { username, password }  →  { token }
 * GET  /api/cms-auth                           →  fenêtre de connexion (flux popup de Decap)
 */
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getStore } from '@netlify/blobs';

const scryptAsync = promisify(scrypt);
const MAX_FAILS = 8; // essais ratés autorisés…
const WINDOW_MS = 15 * 60 * 1000; // …par tranche de 15 minutes et par adresse IP

export const config = { path: '/api/cms-auth' };

export default async (req, context) => {
  if (req.method === 'GET') return popupPage(req);
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const sameOrigin = req.headers.get('origin') === new URL(req.url).origin;
  if (!sameOrigin) return json({ error: 'Origine refusée' }, 403);

  const token = process.env.GITHUB_TOKEN;
  const users = parseUsers(process.env.CMS_USERS);
  if (!token || users.size === 0) {
    return json({ error: "L'admin n'est pas encore configurée (variables CMS_USERS / GITHUB_TOKEN)." }, 500);
  }

  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'inconnue';
  const limiter = await rateLimiter(ip);
  if (limiter.blocked) {
    return json({ error: 'Trop de tentatives. Réessaie dans quelques minutes.' }, 429);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }
  const username = String(body?.username ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');

  const ok = await verify(users.get(username), password);
  if (!ok) {
    await limiter.fail();
    await new Promise((r) => setTimeout(r, 600)); // ralentit les essais en rafale
    return json({ error: 'Identifiant ou mot de passe incorrect.' }, 401);
  }

  await limiter.reset();
  return json({ token, username });
};

/* ---------- Mots de passe ---------- */

function parseUsers(raw = '') {
  const map = new Map();
  for (const entry of raw.split(',').map((s) => s.trim()).filter(Boolean)) {
    const [user, salt, hash] = entry.split(':');
    if (user && salt && hash) map.set(user.toLowerCase(), { salt, hash });
  }
  return map;
}

// Hash factice pour que le temps de réponse soit le même si l'utilisateur n'existe pas
const DUMMY = { salt: '00'.repeat(16), hash: '00'.repeat(64) };

async function verify(record, password) {
  const { salt, hash } = record ?? DUMMY;
  const expected = Buffer.from(hash, 'hex');
  const actual = await scryptAsync(password, Buffer.from(salt, 'hex'), expected.length);
  return Boolean(record) && expected.length === actual.length && timingSafeEqual(expected, actual);
}

/* ---------- Limitation des essais (Netlify Blobs) ---------- */

async function rateLimiter(ip) {
  let store;
  try {
    store = getStore('cms-auth-attempts');
  } catch {
    // Blobs indisponible (ex. en local) : pas de limitation, mais on ne bloque pas la connexion
    return { blocked: false, fail: async () => {}, reset: async () => {} };
  }
  const key = ip.replace(/[^a-zA-Z0-9.:_-]/g, '_');
  const now = Date.now();
  let data = (await store.get(key, { type: 'json' }).catch(() => null)) ?? { count: 0, since: now };
  if (now - data.since > WINDOW_MS) data = { count: 0, since: now };
  return {
    blocked: data.count >= MAX_FAILS,
    fail: () => store.setJSON(key, { ...data, count: data.count + 1 }).catch(() => {}),
    reset: () => store.delete(key).catch(() => {}),
  };
}

/* ---------- Réponses ---------- */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// Fenêtre popup utilisée si Decap affiche son propre bouton de connexion :
// formulaire → POST → transmission du jeton à la fenêtre d'admin (même origine uniquement).
function popupPage(req) {
  const origin = new URL(req.url).origin;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Connexion</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0b;color:#f4f4f0;font:16px/1.5 system-ui,sans-serif}
  form{width:min(100% - 32px,340px);display:grid;gap:12px}
  h1{font-size:28px;margin:0 0 8px;text-transform:uppercase;letter-spacing:-.01em}
  input{font:inherit;padding:12px 14px;border-radius:10px;border:1px solid #333;background:#17171a;color:inherit}
  button{font:inherit;font-weight:700;padding:12px;border:0;border-radius:999px;background:#d4ff3a;color:#0a0a0b;cursor:pointer}
  p{margin:0;color:#ff6b6b;min-height:1.5em}
</style></head><body>
<form id="f"><h1>Connexion</h1>
<input name="username" placeholder="Identifiant" autocomplete="username" required>
<input name="password" type="password" placeholder="Mot de passe" autocomplete="current-password" required>
<button>Se connecter</button><p id="e" role="alert"></p></form>
<script>
const ORIGIN = ${JSON.stringify(origin)};
const f = document.getElementById('f'), err = document.getElementById('e');
f.addEventListener('submit', async (ev) => {
  ev.preventDefault(); err.textContent = '';
  const res = await fetch('/api/cms-auth', { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(new FormData(f))) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { err.textContent = data.error || 'Erreur'; return; }
  if (!window.opener) { err.textContent = 'Fenêtre parente introuvable.'; return; }
  window.addEventListener('message', (e) => {
    if (e.origin !== ORIGIN) return;
    window.opener.postMessage('authorization:github:success:' + JSON.stringify({ token: data.token, provider: 'github' }), ORIGIN);
  }, { once: true });
  window.opener.postMessage('authorizing:github', ORIGIN);
});
</script></body></html>`;
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
      'content-security-policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'",
    },
  });
}
