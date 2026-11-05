# VaultKey — DESIGN.md

## Theme
Dark mode only. No light-mode variant. No section inversions.
All surfaces sit on the same obsidian canvas. Tint shifts within the same dark family only.

---

## 1. Canvas & Surface Hierarchy

| Layer | Value | Notes |
|---|---|---|
| Base canvas | `#08090d` (`--background`) | Page background. Deep obsidian. |
| Panel surface | `#0f131a` (`--card`) | Glass cards, modals, table wrappers. |
| Popover / input | `#121722` (`--popover`, `--input`) | Menus, dialogs, form fields. |
| Hover / muted surface | `#182030` (`--muted`) | Card hover state. |

Source of truth: `web/src/styles/tokens.css`. If this file and the tokens disagree, the tokens win.

### Surface Borders
- Default border: `#1e2638` (`--border`); strong/hover: `#2d3850` (`--border-strong`)
- Focus ring: `#008ff5` with `box-shadow: 0 0 0 2px rgba(0, 143, 245, 0.6)`
- Top sheen (mandatory on all `.glass` and `.glass-glow`): `inset 0 1px 0 rgba(255, 255, 255, 0.08)`
  — this is the edge-refraction highlight that separates cheap glassmorphism from premium.

---

## 2. Color System

One accent family. Do not introduce secondary accents without a documented reason.

| Token | Hex | Use |
|---|---|---|
| `--primary` | `#008ff5` | Focus rings, active states, links (5.5:1 on cards). Matches the logo blue. |
| `--primary-button` | `#006db8` (hover `#005a99`) | Primary button fill. White label is 5.4:1; white on `#008ff5` is only 3.4:1, so never use `--primary` as a button fill. |
| `--success` | `#4ade80` | Success states, "write" badges, encryption confirmed |
| `--warning` | `#f59e0b` | Warning, admin badges, "pending" states |
| `--danger` | `#f87171` | Danger buttons, error toasts |
| `--foreground` | `#f8fafc` | Primary body text, headings |
| `--muted-foreground` | `#94a3b8` | Subtext, table labels, descriptions |
| `--vk-text-muted` | `#8593a8` | Tertiary text (still 6:1 on cards) |

### Accent palette (design v2)
Logo blue leads; the other accents give each product area its own identity. Tokens live in `web/src/styles/tokens.css`, tones in `design-v2.css` (`.tone-blue|violet|cyan|fuchsia|green|amber|red|rose`).

| Token | Hex | Use |
|---|---|---|
| `--blue-light` | `#4db3ff` | Links, eyebrows and headline accents on dark (7.3:1) |
| `--violet` / `--violet-light` | `#8b5cf6` / `#a78bfa` | AI agents, API keys, version history, premium |
| `--cyan` | `#22d3ee` | Runtime, audit, informational |
| `--fuchsia` | `#e879f9` | One-time share links, generator, highlights |
| `--rose` | `#fb7185` | Production environment |
| `--inset` | `#05060a` | Terminals and code wells |

Section tones in the app: Secrets blue, API Keys violet, Audit cyan, Billing green, Settings amber.
Environments: production rose, staging amber, development cyan. Roles: admin amber, write green, read blue.

### Color Rules
- **No gradients.** Buttons, bands, avatars and borders are flat solid colour. The only soft effect is one blue radial glow (max 20% opacity, `.vk-glow`) behind a hero or auth panel.
- Headline accents are solid `--blue-light`, never a multi-colour fill.
- Tinted components (badges, tiles, pills, callouts) use the tone at 12-14% fill and 28-30% border; text uses the tone's light variant.
- Every text pairing must stay at 4.5:1 or better. `--primary` (#008ff5) is never a button fill under white text; use `--primary-button`.
- Badge backgrounds are `tone + 12` opacity (e.g. `rgba(0, 143, 245, 0.12)`).

---

## 3. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headings (h1–h5) | `Cabinet Grotesk, Plus Jakarta Sans, sans-serif` | 800 / 700 | Letter-spacing: `-0.03em` |
| UI Body / Labels | `Inter, sans-serif` | 500 / 400 | Line-height: 1.5 |
| Code / Secrets / Hashes | `JetBrains Mono, monospace` | 600 / 500 | Used for secret keys, version tags, API key strings, audit hashes |
| Badge text | `JetBrains Mono` | 600 | `text-transform: uppercase; letter-spacing: 0.04em` |

### Underline Rule (absolute)
`text-decoration: none !important` on all `a`, `button`, `nav a`, `.btn`.
No exceptions. Link intent is communicated by color and hover state, never underline.

### Scale
- Page title (h1): `clamp(2.5rem, 5.5vw, 4.25rem)`, weight 800
- Section heading (h2): `2.25rem`, weight 800
- Card heading (h3): `1.2rem`, weight 700
- Body: `0.875rem–0.95rem`, weight 400–500
- Labels / eyebrows: `0.75rem–0.8rem`, uppercase, 500–600

---

## 4. Component Tokens

### Buttons
```
.btn             — base: Inter 500, 9px/16px padding, radius 8px, spring transition
.btn-primary     — bg: #006db8, hover: #005a99, shadow: 0 2px 8px rgba(0,143,245,0.3)
.btn-secondary   — bg: rgba(255,255,255,0.05), border: rgba(255,255,255,0.08)
.btn-danger      — bg: rgba(239,68,68,0.1), border: rgba(239,68,68,0.25), text: #f87171
active state     — transform: scale(0.97) on all .btn
```

### Inputs
```
background: #121722
border: 1px solid #1e2638
focus: border #008ff5, box-shadow 0 0 0 2px rgba(0,143,245,0.6)
radius: 8px
padding: 10px 14px
```

### Badges
```
padding: 3px 10px, radius 6px
font: JetBrains Mono 600, 0.725rem, uppercase, tracking 0.04em
badge-admin: amber bg/border/text
badge-write: emerald bg/border/text
badge-read:  blue (#008ff5) bg/border/text
```

### Tables
```
th: Inter 0.75rem 600, uppercase, muted color, tracking 0.06em
td: 14px/18px padding, border-bottom rgba(255,255,255,0.08)
row hover: background rgba(255,255,255,0.02)
```

---

## 5. Motion

Spring easing on everything interactive: `cubic-bezier(0.16, 1, 0.3, 1)`
Duration: `0.15s–0.2s`. Never `linear`. Never `ease-in` alone.

| Interaction | Animation |
|---|---|
| Page entry | `opacity 0→1, translateY 6px→0`, 0.25s spring |
| Button hover | `box-shadow` expansion, 0.15s |
| Button active | `scale(0.97)`, 0.15s |
| Card hover | `border-color` shift + `box-shadow` depth increase, 0.2s |
| Modal open | `opacity 0→1, scale 0.97→1`, 0.2s spring |
| Toast entry | `opacity 0→1, translateY 6px→0`, fixed bottom-right |

No infinite-loop animations on data surfaces. The terminal hero block is static.
The command palette entry uses the standard page-entry spring.

---

## 6. Layout Rules

- Max content width: `1200px`, `margin: 0 auto`.
- Internal page padding: `16px 24px 60px 8px` (inside AppLayout main).
- Bento metric grids: 4-column responsive, `flex-wrap`, `flex: 1 1 200px` per cell.
- Table wrappers: `.glass` with `overflow: hidden`, no explicit height.
- Modals: centered overlay, `backdrop-filter: blur(8px)` on the overlay scrim.

### Radius Consistency (locked)
- Glass cards / modals: `14px–18px`
- Buttons: `8px`
- Inputs: `8px`
- Badges: `6px`
- Pills / eyebrows: `999px`
Do not mix radii families. A pill button in a square-card layout is broken design.

---

## 7. Do's and Don'ts

**Do:**
- Show the HMAC hash strings in monospace — they communicate technical credibility.
- Use the emerald accent for any "success / encrypted / verified" state.
- Use spring easing on every interactive transition.
- Keep `.glass` top sheen (`inset 0 1px 0 rgba(255,255,255,0.08)`) on all panels.
- Keep all files under 200 LoC — extract new components rather than growing files.

**Don't:**
- Don't add underlines to any link, button, or tab — ever.
- Don't use gradients anywhere. Use flat colour plus the single blue glow.
- Don't invent customer logos, fake metrics, or made-up case studies.
- Don't use serif fonts (Fraunces, Instrument Serif, Playfair) — this is a dark-tech B2B tool.
- Don't add infinite-loop animations to table rows or metric cards.
- Don't use `linear` or `ease-in` easing — always spring cubic-bezier.
