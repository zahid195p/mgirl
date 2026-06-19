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

## The admin panel (per-person GitHub login)

The `/admin` panel uses **Sveltia CMS** with **per-person GitHub login** — no
shared secret, no OAuth app, no server. Each editor signs in with their own
GitHub account using a personal access token.

### Who can edit

Only **repo collaborators** can save changes. The owner can edit already; add
others:

- GitHub → repo → **Settings → Collaborators → Add people** (by username), or
- `gh api -X PUT repos/<you>/<repo>/collaborators/<their-username> -f permission=push`

A logged-in person who is **not** a collaborator cannot save or delete anything
— GitHub rejects it. Remove anyone anytime; every change is a revertible commit.

### How an editor logs in

1. Go to `https://<you>.github.io/<repo>/admin/`.
2. Click **Sign in with Token**.
3. Follow the pre-filled link to create a GitHub **personal access token**
   (the required scope is pre-selected), copy it, and paste it back.
4. Edit and **Publish** — the site rebuilds automatically.

See [docs/EDITING.md](docs/EDITING.md) for the supervisor's step-by-step.

## Security notes

- Editing requires write access to **this repo** — you control the collaborator
  list and can remove anyone at once.
- No secret lives in the public code. Each editor's token stays in their own
  browser; they can revoke it anytime from GitHub.
- Every change is an attributed, revertible git commit — nothing is ever lost.

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
  admin/             # Sveltia CMS panel (index.html + config.yml)
  images/uploads/    # editor-uploaded media lands here
.github/workflows/   # GitHub Pages deploy
```
