# MGIRL — Molecular Genetics of Insecticide Resistance Laboratory

The website for the MGIRL lab (Department of Entomology, University of
Agriculture Faisalabad). Built with [Astro](https://astro.build), hosted free on
GitHub Pages, with a content admin panel ([Decap CMS](https://decapcms.org)) so
the lab can add people, publications, projects, news and events without touching
code.

---

## The two layers (important mental model)

| Layer | What it is | Who edits it | How |
|-------|-----------|--------------|-----|
| **Chrome** | Layout, navigation, homepage design, theme, animations | Developer | Code (`src/`) |
| **Content** | People, publications, projects, news, events, photos | Any admin | The `/admin` panel |

Admins **cannot** break the layout — they only fill in forms. Everything visual
lives in code.

---

## Run it locally

Requires **Node.js 18+** (you have it).

```bash
npm install        # once
npm run dev        # start dev server → http://localhost:4321
npm run build      # production build into dist/
npm run preview    # preview the production build
```

### Edit content locally (optional, no GitHub needed)

The admin panel can run against your local files:

```bash
# terminal 1
npx decap-server
# terminal 2
npm run dev
```

Then open <http://localhost:4321/admin/>. `local_backend: true` in
`public/admin/config.yml` routes saves to your working copy. Great for trying
the editing experience before going live.

---

## Content model

Markdown files under `src/content/` — schemas in `src/content.config.ts`.

- **people** — PI, scholars, staff, collaborators, alumni (drives the team tree)
- **publications** — the single source of truth for each paper
- **projects** — link a lead, members, and related publications
- **news** — announcements (set `pinned: true` to float to the homepage top)
- **events** — conferences, seminars, presentations, defenses

**The interlink that matters:** a publication lists its lab authors via
`labAuthors`. Each person's page then *derives* their publications automatically
— so one paper appears on every co-author's page with **no duplication**.

---

## Deploy to GitHub Pages (free)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial MGIRL website"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

### 2. Set the base path

For a **project site** at `https://<you>.github.io/<repo>`, edit
`astro.config.mjs`:

```js
site: 'https://<you>.github.io',
base: '/<repo>',
```

(For a custom domain or `<you>.github.io` user site, keep `base: '/'`.)
Commit and push.

### 3. Turn on Pages

Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The included workflow (`.github/workflows/deploy.yml`) builds and deploys on
every push to `main`. Done — your site is live.

---

## Enable the admin panel (shared-code login)

The `/admin` panel needs a way to log in. You chose a **single shared code**,
which needs one small free Cloudflare Worker as the gate.

### 1. Create a GitHub token

GitHub → Settings → Developer settings → **Fine-grained personal access
tokens** → only the content repo → permission **Contents: Read and write**.
Copy it.

### 2. Deploy the Worker

```bash
cd deploy/cms-auth-worker
npx wrangler login
npx wrangler secret put ADMIN_CODE      # the code admins will type
npx wrangler secret put GITHUB_TOKEN    # the token from step 1
npx wrangler deploy
```

Wrangler prints a URL like `https://mgirl-cms-auth.<sub>.workers.dev`.

### 3. Point the CMS at it

In `public/admin/config.yml`, set:

```yaml
backend:
  name: github
  repo: <you>/<repo>
  branch: main
  base_url: https://mgirl-cms-auth.<sub>.workers.dev
  auth_endpoint: auth
```

Commit and push. Now `https://<you>.github.io/<repo>/admin/` asks for the code,
and on success an admin can publish. See [docs/EDITING.md](docs/EDITING.md) for
the supervisor's how-to.

> **Prefer per-person logins instead?** Each editor can use their own GitHub
> account (added as a repo collaborator). That still needs an OAuth step, but
> [Sveltia CMS](https://github.com/sveltia/sveltia-cms) — a drop-in replacement
> for Decap that reads this same `config.yml` — can do GitHub login with much
> less setup and no Worker. Ask and we can switch in a few minutes.

---

## Security notes (shared code)

- Anyone with the code can publish; rotate it anytime with
  `npx wrangler secret put ADMIN_CODE`.
- Keep the GitHub token scoped to **only this repo**, Contents-only.
- All edits commit as the same identity, so you can't tell *who* made a change.

---

## Custom domain (later, optional)

GitHub Pages supports custom domains for free (you only pay for the domain name
itself). Repo → Settings → Pages → Custom domain. Then set `base: '/'` and
`site: 'https://yourdomain.org'` in `astro.config.mjs`.

---

## Project structure

```
src/
  content/            # the editable content (Markdown)
  content.config.ts   # content schemas + relationships
  components/         # reusable UI pieces
  layouts/            # page shell
  pages/             # routes (index + list + [slug] detail pages)
  lib/               # site config + helpers
  styles/global.css  # the design system
public/
  admin/             # Decap CMS panel (index.html + config.yml)
  images/uploads/    # admin-uploaded media lands here
deploy/
  cms-auth-worker/   # Cloudflare Worker for shared-code login
.github/workflows/   # GitHub Pages deploy
```
