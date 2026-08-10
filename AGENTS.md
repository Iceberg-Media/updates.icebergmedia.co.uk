# AGENTS.md — updates.icebergmedia.co.uk

## Project Overview
Astro 7 static site deployed to **Cloudflare Pages**. Posts live in `src/content/blog/en/` as `.mdx` files. Each post has a matching SVG illustration in `src/assets/blog/`.

## Creating a New Update (copy-paste workflow)

### 1. Create the MDX post
File: `src/content/blog/en/<slug>.mdx`

```yaml
---
title: "Title Here"
description: "160 char max description."
publishedAt: YYYY-MM-DD
updatedAt: YYYY-MM-DDT00:00:00.000Z
author: "Iceberg Media"
tags: ["tag1", "tag2"]
featured: true
locale: en
svgSlug: "<slug>"
---
```

Frontmatter fields:
- `slug` = filename without `.mdx`
- `svgSlug` = must match filename without extension
- `featured: true` = shows on homepage Featured section (max 2-3 recommended)
- Tags must match existing tag slugs in `src/content/pages/` (check for `local-seo`, `gbp`, `reviews`, `citations`, `uk`, etc.)

### 2. Create the SVG illustration
File: `src/assets/blog/<slug>.svg`

SVG dimensions: `1200 x 630` (OG image ratio). Dark theme (`#0f172a` / `#1e293b` backgrounds, `#f1f5f9` text). Use `system-ui, sans-serif` font. Match the style of existing SVGs — check `get-more-google-reviews.svg` or `pick-right-gbp-category.svg` for reference.

### 3. Build & deploy to Cloudflare Pages

**Local build requires switching the adapter** (workerd crashes on this machine):

```bash
cd /home/fansfollow/projects/_iceberg/updates.icebergmedia.co.uk/rocket

# Backup original config
cp astro.config.mjs astro.config.mjs.bak

# Replace adapter: cloudflare() → adapter: netlify() (import + usage)
# Quick way: sed the two lines
sed -i "s|import cloudflare from '@astrojs/cloudflare';|import netlify from '@astrojs/netlify';|" astro.config.mjs
sed -i "s|adapter: cloudflare(),|adapter: netlify(),|" astro.config.mjs

# Build
npx astro build

# Restore original
cp astro.config.mjs.bak astro.config.mjs && rm astro.config.mjs.bak

# Deploy
rm -rf .wrangler
wrangler pages deploy dist --project-name=updates-icebergmedia --commit-dirty=true
```

Cloudflare Pages project name: `updates-icebergmedia`
Wrangler is authenticated via `CLOUDFLARE_API_TOKEN` env var.

### 4. Verify
- Post URL: `https://updates.icebergmedia.co.uk/<slug>/`
- SVG renders: `curl -s https://updates.icebergmedia.co.uk/<slug>/ | grep '<slug>.svg'`
- Featured on homepage: `curl -s https://updates.icebergmedia.co.uk/ | grep '<slug>'`

### 5. Commit to git
```bash
git add src/content/blog/en/<slug>.mdx src/assets/blog/<slug>.svg
git commit -m "Add <topic> update"
git push origin main
```

## CI/CD Notes

### GitHub Actions (backup, not primary deploy)
File: `.github/workflows/deploy.yml`
- Runs lint → type check → build on push to main
- Does NOT deploy — that's Cloudflare Pages
- Uses `pnpm/action-setup@v4` (auto-detects pnpm version from lockfile)
- Node 22

### Known issues
- **pnpm workarounds**: `pnpm-workspace.yaml` must have `allowBuilds` entries for `esbuild`, `sharp`, `workerd`, `@parcel/watcher` set to `true`
- **workerd crash locally**: The `@astrojs/cloudflare` adapter crashes on this machine (SQLite version mismatch). Always switch to `@astrojs/netlify` for local builds, then restore.
- **Lint pre-existing errors**: `src/pages/[...slug].astro` had a parse error with inline regex — was fixed by extracting to a variable. Watch for similar issues.
- **ESLint warnings** (non-blocking): unused vars in `astro.config.mjs`, `tag/[tag].astro` — these don't fail CI.

## Post Style Guidelines
- UK English spelling (colour, optimise, etc.)
- Lead with the action, not the explanation
- Keep posts short: 1-3 min read
- Include "Related" links at the bottom linking to other posts
- Data-backed posts: cite the source at the end
- No lorem ipsum, no filler
