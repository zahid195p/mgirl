/**
 * MGIRL CMS — shared-code auth Worker (Cloudflare Workers, free tier).
 *
 * WHAT IT DOES
 *   Decap CMS (the /admin panel) uses GitHub to save content, but GitHub
 *   normally requires each editor to log in with their own account. This Worker
 *   replaces that with a single shared CODE: an admin opens /admin, types the
 *   code, and the Worker hands the CMS a GitHub token so it can publish.
 *
 * TWO SECRETS (set with `wrangler secret put`, never commit them):
 *   ADMIN_CODE    – the shared code admins type to log in. Rotate anytime.
 *   GITHUB_TOKEN  – a fine-grained Personal Access Token limited to the ONE
 *                   content repo, with "Contents: Read and write" permission.
 *
 * SECURITY NOTE (be aware): anyone who knows ADMIN_CODE can publish, and the
 * GitHub token is handed to the logged-in browser (this is how Decap's GitHub
 * backend works). Keep the token scoped to just this repo, and rotate both
 * secrets if the code is ever shared too widely. For per-person logins instead,
 * see the README (one-line config change, no Worker needed).
 */

const PROVIDER = 'github';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth' || url.pathname === '/auth/') {
      if (request.method === 'POST') {
        const form = await request.formData();
        const code = (form.get('code') || '').toString();
        const ok =
          env.ADMIN_CODE &&
          env.GITHUB_TOKEN &&
          timingSafeEqual(code, env.ADMIN_CODE);
        if (ok) return htmlResponse(successPage(env.GITHUB_TOKEN), 200);
        return htmlResponse(loginPage('That code was not correct. Please try again.'), 401);
      }
      return htmlResponse(loginPage(), 200);
    }

    return new Response('MGIRL CMS auth worker is running. The CMS uses /auth.', {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  },
};

function htmlResponse(body, status) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-frame-options': 'DENY',
    },
  });
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

function loginPage(error) {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>MGIRL Admin — Sign in</title>
<style>
  :root{color-scheme:light dark}
  body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f6f8f6;color:#16211c}
  @media(prefers-color-scheme:dark){body{background:#0e1512;color:#e7efe9}}
  form{background:Canvas;padding:2rem;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.12);width:min(360px,92vw);text-align:center}
  h1{font-size:1.2rem;margin:0 0 .25rem}
  p{color:#586b62;font-size:.9rem;margin:0 0 1.25rem}
  input{width:100%;padding:.7rem .9rem;font-size:1rem;border:1px solid #cbd5cf;border-radius:10px;box-sizing:border-box;margin-bottom:.9rem}
  button{width:100%;padding:.7rem;font-size:1rem;font-weight:600;color:#fff;background:#1f6e43;border:0;border-radius:999px;cursor:pointer}
  .err{color:#b3261e;font-size:.85rem;margin-bottom:.75rem}
  .mark{font-size:1.8rem}
</style></head><body>
<form method="POST" action="/auth">
  <div class="mark">🪲</div>
  <h1>MGIRL Content Admin</h1>
  <p>Enter the shared admin code to continue.</p>
  ${error ? `<div class="err">${escapeHtml(error)}</div>` : ''}
  <input type="password" name="code" placeholder="Admin code" autofocus required autocomplete="off">
  <button type="submit">Sign in</button>
</form>
</body></html>`;
}

function successPage(token) {
  const payload = JSON.stringify({ token: String(token), provider: PROVIDER });
  // Decap/Netlify CMS OAuth handshake: announce, wait for the opener to reply,
  // then post the token back to the opener's origin.
  return `<!doctype html><html><head><meta charset="utf-8"><title>Signing in…</title></head>
<body style="font-family:system-ui;display:grid;place-items:center;min-height:100vh;margin:0">
<p>Signing you in…</p>
<script>
  (function () {
    var data = ${payload};
    function receive(e) {
      window.opener && window.opener.postMessage(
        'authorization:${PROVIDER}:success:' + JSON.stringify(data),
        e.origin
      );
      window.removeEventListener('message', receive, false);
    }
    window.addEventListener('message', receive, false);
    window.opener && window.opener.postMessage('authorizing:${PROVIDER}', '*');
  })();
</script>
</body></html>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
