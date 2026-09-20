# VaultKey Design System — Ink & Signal Specification

The VaultKey Design System enforces a dark-mode-first, high-density, terminal-adjacent aesthetic inspired by high-end developer infrastructure tools (Linear, Tailscale, Fly.io).

---

## 1. Core Principles

1. **Restraint Over Decoration**: Zero unnecessary gradients, 3D shadows, or glowing orbs. Surfaces are matte, borders are crisp, contrast is calculated.
2. **Typography as Structure**: Cabinet Grotesk for high-contrast headings and brand identity; General Sans for clean geometric body and UI labels; JetBrains Mono for secrets, keys, hashes, CLI commands, and telemetry.
3. **Signal Accents**: `#6A8DD8` (Slate Blue, derived from 21st.dev SKEELLS theme) is the primary accent. Used strictly for interactive primary actions, active indicators, and focus rings. Never for large background fills.
4. **Token Strictness**: No raw hex values in JSX or inline styles. Every component must reference standard CSS variables (`var(--vk-*)`) or Tailwind theme classes.
5. **Modularity & 200 LoC Rule**: Every file must remain single-responsibility and strictly under 200 Lines of Code.

---

## 2. Color Tokens

### Surface Hierarchy
| Token | Hex | Role |
|---|---|---|
| `--vk-bg` | `#060608` | Deep void canvas background |
| `--vk-surface-1` | `#0D0E11` | Primary cards, panels, modals, dropdowns |
| `--vk-surface-2` | `#14151A` | Hovered cards, secondary buttons, inputs |
| `--vk-surface-3` | `#1D1F25` | Active states, elevated chips |

### Border Hierarchy
| Token | Value | Role |
|---|---|---|
| `--vk-border` | `#21232A` | Standard component border |
| `--vk-border-strong` | `#2E313B` | Hovered cards, active inputs |
| `--vk-border-subtle` | `#16181E` | Subtle dividers, table row borders |
| `--vk-border-focus` | `rgba(106, 141, 216, 0.5)` | Keyboard focus ring |

### Typography Colors
| Token | Hex | Contrast / Role |
|---|---|---|
| `--vk-text` | `#F0F1F3` | Primary headings, titles, active labels |
| `--vk-text-secondary` | `#8C909A` | Descriptions, inactive tabs, table data |
| `--vk-text-muted` | `#55585F` | Placeholders, timestamps, breadcrumbs |

### Signal & Semantic Tokens
| Role | Token | Tint / Dim Token |
|---|---|---|
| Slate Blue (Primary) | `--vk-accent: #6A8DD8` | `--vk-accent-dim: rgba(106, 141, 216, 0.10)` |
| Success (Green) | `--vk-success: #4ADE80` | `--vk-success-dim: rgba(74, 222, 128, 0.10)` |
| Warning (Amber) | `--vk-warning: #F59E0B` | `--vk-warning-dim: rgba(245, 158, 11, 0.10)` |
| Danger (Red) | `--vk-danger: #F87171` | `--vk-danger-dim: rgba(248, 113, 113, 0.10)` |

---

## 3. Radii Scale

| Token | Size | Application |
|---|---|---|
| `--radius-sm` | `6px` | Badges, tags, code chips, checkboxes |
| `--radius-md` | `8px` | Buttons, text inputs, dropdown selects |
| `--radius-lg` | `14px` | Cards, modals, workflow preview windows |
| `--radius-full` | `9999px` | Avatars, indicator dots |

---

## 4. Spacing Scale (4px Base Grid)

- `4px` (`gap-1`, `p-1`): Micro gaps, badge icon spacing
- `8px` (`gap-2`, `p-2`): Button inner gap, input padding-y
- `12px` (`gap-3`, `p-3`): Input padding-x, list spacing
- `16px` (`gap-4`, `p-4`): Card inner padding, section headers
- `24px` (`gap-6`, `p-6`): Modal padding, desktop card padding
- `32px` (`gap-8`, `p-8`): Page header bottom margin, section gap
- `64px` - `80px`: Major landing section vertical margins

---

## 5. Standard Component Primitives

All UI components reside in `web/src/components/ui/`:

1. **`Button`**: Variants: `default` (primary signal), `secondary` (surface-2), `outline`, `ghost`, `destructive`.
2. **`Input`**: Standard text input with optional `icon`, `error`, and `mono` font support.
3. **`Textarea`**: Multi-line input styled with identical focus and border tokens as `Input`.
4. **`Select`**: Dropdown select styled with identical tokens as `Input`.
5. **`StatusBadge`**: Pill badge for environments, roles, and status states (`success`, `warning`, `danger`, `accent`, `neutral`).
6. **`Card`**: Standard surface-1 container with subtle border.
7. **`Modal`**: Accessible dialog with backdrop blur, focus trap, and Escape key dismissal.
8. **`PageHeader`**: Consistent breadcrumb + title + description + actions bar across all app screens.
9. **`EmptyState`**: Standard empty list / zero-results presentation.
10. **`Kbd`**: Keyboard shortcut indicator with monospace styling.
