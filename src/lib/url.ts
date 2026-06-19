// Base-aware URL helper so internal links keep working whether the site is
// served from the domain root ('/') or a GitHub Pages subpath ('/repo/').
const BASE = import.meta.env.BASE_URL || '/';

export function url(path = '/'): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE; // '' or '/repo'
  const p = path.startsWith('/') ? path : `/${path}`;
  const out = `${base}${p}`;
  return out === '' ? '/' : out;
}

// For values that may already be absolute (uploaded media, external links).
export function asset(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return url(path);
}
