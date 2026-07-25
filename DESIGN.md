# VaultKey — DESIGN.md

## Theme
Dark mode only. No light-mode variant. No section inversions.
All surfaces sit on the same obsidian canvas. Tint shifts within the same dark family only.

---

## 1. Canvas & Surface Hierarchy

| Layer | Value | Notes |
|---|---|---|
| Base canvas | `#0b0e14` | Page background. Deep obsidian. |
| Panel surface | `#121824` | Glass cards, modals, table wrappers. |
| Hover surface | `#182030` | Card hover state. |
| Input background | `#090c14` | Darker than panel to create inset depth. |

### Surface Borders
- Default border: `1px solid rgba(255, 255, 255, 0.08)`
- Hover border: `rgba(255, 255, 255, 0.16)`
- Focus ring: `#6366f1` with `box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25)`
- Top sheen (mandatory on all `.glass` and `.glass-glow`): `inset 0 1px 0 rgba(255, 255, 255, 0.08)`
  — this is the edge-refraction highlight that separates cheap glassmorphism from premium.

---

## 2. Color System

One accent family. Do not introduce secondary accents without a documented reason.

| Token | Hex | Use |
|---|---|---|
| `--accent-primary` | `#6366f1` | Buttons, focus rings, active states |
| `--accent-glow` | `linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)` | Hero logo, billing pro card highlight |
| `--accent-emerald` | `#10b981` | Success states, "write" badges, encryption confirmed |
| `--accent-amber` | `#f59e0b` | Warning, admin badges, "pending" states |
| `--accent-red` | `#ef4444` | Danger buttons, error toasts |
| `--text-main` | `#f8fafc` | Primary body text, headings |
| `--text-muted` | `#94a3b8` | Subtext, table labels, descriptions |
| `--text-label` | `#cbd5e1` | Form labels, secondary body |

### Color Rules
- Accent is locked per-page. A purple CTA does not become teal in section 5.
- No random neon gradients on background canvases. The gradient is reserved for
  the hero logo icon and the billing pro card's border treatment only.
- Badge backgrounds are always `accentColor + 12` opacity (e.g. `rgba(99, 102, 241, 0.12)`).

---

## 3. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headings (h1–h5) | `Outfit, sans-serif` | 800 / 700 | Letter-spacing: `-0.025em` |
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
.btn-primary     — bg: #6366f1, hover: #4f46e5, shadow: 0 2px 8px rgba(99,102,241,0.3)
.btn-secondary   — bg: rgba(255,255,255,0.05), border: rgba(255,255,255,0.08)
.btn-danger      — bg: rgba(239,68,68,0.1), border: rgba(239,68,68,0.25), text: #f87171
active state     — transform: scale(0.97) on all .btn
```

### Inputs
```
background: #090c14
border: 1px solid rgba(255,255,255,0.08)
focus: border #6366f1, box-shadow 0 0 0 2px rgba(99,102,241,0.25)
radius: 8px
padding: 10px 14px
```

### Badges
```
padding: 3px 10px, radius 6px
font: JetBrains Mono 600, 0.725rem, uppercase, tracking 0.04em
badge-admin: amber bg/border/text
badge-write: emerald bg/border/text
badge-read:  indigo bg/border/text
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
- Don't use the gradient accent on backgrounds — only on the logo icon and pro card border.
- Don't invent customer logos, fake metrics, or made-up case studies.
- Don't use serif fonts (Fraunces, Instrument Serif, Playfair) — this is a dark-tech B2B tool.
- Don't add infinite-loop animations to table rows or metric cards.
- Don't use `linear` or `ease-in` easing — always spring cubic-bezier.
