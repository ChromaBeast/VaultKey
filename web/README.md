# VaultKey web

The VaultKey web app and marketing site: a React 19 + TypeScript single-page app built with Vite and Tailwind CSS v4, served as static files by nginx behind Caddy. The Go API lives in the repository root; this app talks to it over `/v1/*`.

## Quick start

Requires [Bun](https://bun.sh) 1.x. From this folder:

```bash
bun install
bun run dev        # http://localhost:5173, proxies /v1 to http://localhost:8080
```

Run the API from the repository root (`go run ./cmd/server`, see the root README) so sign-in and data requests work. The marketing pages, docs and 404 work without it.

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Vite dev server with hot reload |
| `bun run build` | Type-check (`tsc -b`) and production build to `dist/` |
| `bun run preview` | Serve the production build locally |
| `bun run lint` | ESLint |
| `bun test tests` | Unit tests (Bun test runner) |
| `bun run test:e2e` | Playwright smoke and accessibility tests (builds and serves the app itself) |

First time running e2e: `bunx playwright install chromium`.

## Project layout

```
src/
  pages/        route components (marketing, auth, app screens)
  components/   shared UI; ui/ holds primitives (Button, Modal, IconTile, StatCard ...)
  components/landing, docs, auth, settings   feature folders
  context/      AuthContext (session, org, user)
  lib/          API client, permissions, toast bus, helpers
  styles/       all CSS (see below)
e2e/            Playwright specs, fixtures and the axe helper
public/         static files: logo, favicons, fonts, og-image, robots.txt, sitemap.xml
brand/          logo source and the script that regenerates public/og-image.png
```

## Styling

Design tokens live in `src/styles/tokens.css` (CSS variables) and are the single source of truth. [`../DESIGN.md`](../DESIGN.md) documents the palette, tones, type and rules; if the two disagree, the tokens win.

`src/index.css` imports every stylesheet in a fixed order. Conventions:

- **Every stylesheet except `tokens.css` and `fonts.css` is wrapped in `@layer components`** (or `base`). Do not add unlayered rules: they silently beat both layered CSS and Tailwind utilities.
- Prefer classes over inline `style={{}}`. Inline styles also force `'unsafe-inline'` in the production CSP.
- Icons are bare by default (`IconTile`); pass `boxed` only where a container is a deliberate focal point (empty states).
- No gradients. Heroes use one soft blue glow (`.vk-glow`).
- Keep source files under ~200 lines; split components rather than growing them.

## Testing

- `tests/` holds fast unit tests for helpers.
- `e2e/` renders every marketing route and the main signed-in screens against **mocked API responses** (`e2e/helpers.ts`), checks key behaviour, and runs axe (WCAG 2 A/AA). Serious or critical violations fail the run. Mobile specs check for horizontal overflow and the navigation drawer.

CI runs lint, type-check, unit tests, the build and the e2e suite before it builds and pushes the web image.

## Brand assets

`public/vaultkey-logo.png` is a 192px export of `brand/vaultkey-logo-source.png` (the 1254px original). Regenerate the social image with `python3 brand/make-og-image.py` (needs Pillow). The production hostname used in `og:image`, `robots.txt` and `sitemap.xml` is `vaultkey.sheershjaiswal.in`; update those if the domain changes.

## Deployment

Pushes to `main` that touch `web/**` run the pipeline in `.github/workflows/deploy.yml`: lint, type-check, tests, build, push `ghcr.io/chromabeast/vaultkey-web`, then deploy to the VPS and wait for the health check. The image is built from `web/Dockerfile` (Bun build, nginx runtime). Security headers (CSP, HSTS, frame denial) are set by Caddy, not nginx.
