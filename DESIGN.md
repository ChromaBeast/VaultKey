# VaultKey Design System Spec (Impeccable Style)

## Visual Principles

### 1. Canvas & Surface Hierarchy (Quiet Depth)
- **Base Canvas**: `#090d16` (Deep Obsidian Void)
- **Primary Panel**: `rgba(15, 23, 42, 0.7)` with `backdrop-filter: blur(24px)`
- **Interactive Card**: `rgba(30, 41, 59, 0.75)`
- **Border**: `rgba(255, 255, 255, 0.08)` subtle hairline with `inset 0 1px 0 0 rgba(255, 255, 255, 0.1)` top sheen

### 2. Strategic Color & Glows (Colorize)
- **Accent Purple**: `#8b5cf6` (Glow: `rgba(139, 92, 246, 0.25)`)
- **Accent Cyan**: `#06b6d4` (Glow: `rgba(6, 182, 212, 0.2)`)
- **Success Emerald**: `#10b981` (Glow: `rgba(16, 185, 129, 0.2)`)
- **Danger Red**: `#ef4444` (Glow: `rgba(239, 68, 68, 0.2)`)

### 3. Typeset Hierarchy
- **Headings / Display**: `Outfit, sans-serif` (800 weight, `-0.025em` tracking)
- **Interface UI**: `Inter, sans-serif` (500/600 weight)
- **Tokens / Secrets**: `JetBrains Mono, monospace` (600 weight, uppercase caps for badges)

### 4. Micro-Motion & Animation (Animate)
- **Transitions**: `all 0.2s cubic-bezier(0.16, 1, 0.3, 1)`
- **Hover elevation**: `transform: translateY(-2px)` with expanded glow
- **Active press**: `transform: translateY(0) scale(0.98)`
