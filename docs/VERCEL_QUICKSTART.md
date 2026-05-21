# Vercel Quickstart — Scratch Match

Deploy the public-facing Scratch Match landing, brochure, tarpaulin, and feedback CTA to Vercel via the CLI in ~5 minutes.

## What gets deployed (and what doesn't)

**Works on Vercel:**
- Landing page (`/`) with feedback ribbon and Resources modal
- Brochure (`/brochure/brochure.html`)
- Tarpaulin (`/tarpaulin/tarpaulin.html`)
- Static onboarding/login/signup *pages* (UI renders)

**Will not work on Vercel:**
- `/api/*` routes — they need a running Qdrant + Ollama + writable SQLite, none of which exist in Vercel's serverless runtime.
- Anything past login: dashboards, CV upload, matching, advisor chat.

This deploy exists to host the marketing surface and feedback link for the presentation, not to run the matcher. Demo the live app from localhost.

---

## Prerequisites

- Node.js 20+ and npm
- A Vercel account (free tier is fine)
- Git working tree committed (Vercel deploys from the working directory's git head when using `vercel`, but uncommitted edits do get bundled — committing first keeps it clean)

## 1. Install the Vercel CLI

```bash
npm i -g vercel
```

Verify:

```bash
vercel --version
```

## 2. Log in

```bash
vercel login
```

Choose your auth method (GitHub, GitLab, Bitbucket, email). The CLI opens a browser tab — confirm and return.

## 3. Link the project

From the repo root:

```bash
cd "C:\Users\John Andre Yap\Documents\Coding Stuff\scratch-match"
vercel link
```

Answer the prompts:
- **Set up "~\scratch-match"?** → `Y`
- **Which scope?** → your personal account (or team)
- **Link to existing project?** → `N` (first time)
- **Project name?** → `scratch-match` (or accept default)
- **In which directory is your code located?** → `./`

This creates a `.vercel/` folder (already in `.gitignore` by default — verify).

## 4. Local production build sanity check

Before deploying, confirm the build runs locally:

```bash
npm install
npm run build
```

If `next build` errors on pre-existing type issues in `src/lib/qdrant.ts`, you can either fix them or add `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` (acceptable for a showcase deploy). The landing page itself does not import those files.

## 5. Deploy a preview

```bash
vercel
```

Vercel uploads, builds, and returns a preview URL like `https://scratch-match-xxxx.vercel.app`. Open it and confirm:
- Top gold feedback ribbon appears
- Header has **Brochure** and **Tarpaulin** buttons that open modals
- Brochure modal → "Open brochure →" loads `/brochure/brochure.html` with all images
- Tarpaulin modal → "Open tarpaulin →" loads `/tarpaulin/tarpaulin.html`
- "About this prototype" section is present on the landing page
- Footer has the Resources column with the same three links

## 6. Promote to production

```bash
vercel --prod
```

Returns your stable URL (`https://scratch-match.vercel.app` or your assigned project domain). Share this link with feedback respondents.

---

## Useful follow-ups

### Custom domain

```bash
vercel domains add your-domain.com
```

Then assign it via the Vercel dashboard → Project → Settings → Domains.

### Environment variables (optional)

The landing-only deploy needs none. If you later add a `NEXT_PUBLIC_DEMO_MODE` flag to surface a "preview only" banner on auth pages:

```bash
vercel env add NEXT_PUBLIC_DEMO_MODE
# value: true
# environments: Production, Preview
```

### Redeploy after changes

```bash
git add . && git commit -m "..."
vercel --prod
```

Or hook the GitHub repo to Vercel via the dashboard for auto-deploys on push.

### Roll back

```bash
vercel rollback
```

Pick a previous deployment from the list.

---

## Troubleshooting

**Build fails on `better-sqlite3`.** It's marked as a `serverComponentsExternalPackages` in `next.config.mjs`, which should let Vercel skip bundling. If it still fails, the API routes that import it can be temporarily disabled by renaming `src/app/api` to `src/app/_api_disabled` for the showcase deploy.

**Brochure images don't load.** Check that `public/brochure/assets/` made it into the deploy. The brochure references images with relative `assets/...` paths.

**Pre-existing TypeScript errors block build.** Add `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` if you don't want to fix `src/lib/qdrant.ts` typing before the presentation.
