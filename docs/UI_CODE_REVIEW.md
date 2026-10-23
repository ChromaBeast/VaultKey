# UI and code review

Reviewed the current working tree across the homepage, workflow, security, pricing,
documentation, sign-in, signup, password reset, secrets, API keys, audit, settings,
and billing. Preserved the implemented blue-accent design and pre-existing edits.

## Interface fixes

- Secondary secret actions use a positioned, keyboard-accessible menu without changing table row heights.
- Mobile navigation starts closed, uses the shared dialog focus containment, and fills the left edge of the viewport.
- Dialogs have accessible names, retain focus across input changes, support nested dialogs, and scroll within small viewports.
- Secret and audit metadata uses plain text where badges added noise. Removed extra homepage screenshot framing, workflow card nesting, and auth decoration.
- Filters fit small screens. Audit project filtering has an explicit Apply button and the correct accessible name; pagination and export wait for data.
- Inputs expose validation errors and visible focus. Sign-in's password has a real label; password visibility respects disabled state.
- Settings recognizes owners as administrators. Read-only members see appropriate controls; owner/self removal is disabled.
- Billing shows load errors instead of empty history and distinguishes subscription end dates from renewal dates.

## Code fixes

- Production auth configuration no longer references a test-only symbol. Captcha requirements match environment policy.
- Billing mutation routes and payment history require administrator permission server-side, with corresponding UI behavior.
- The command palette creates secrets from both the current secrets route and other routes.
- Using the generator inside a create form preserves its draft name and updates its value.
- Stale secret reveal/edit responses cannot open a dialog after switching project or leaving the page. List refresh requests are cancelled on cleanup.
- Session hydration uses one consistent state object; an old unauthorized response cannot erase a newer login.
- API requests preserve Headers instances. CSV export escapes quotes, carriage returns, and spreadsheet formula prefixes.
- Docs deep links initialize correctly without the lint-failing state effect. Copy feedback timers clean up and restart consistently.
- Share pages remount for each share ID, preventing prior share content from carrying into another link.
- API key quotas exclude session keys and expired tokens; expired keys have a distinct status.
- Route-level lazy loading and a simpler sidebar reduced the main production JavaScript bundle from 548 kB to 275 kB (before gzip).

## Verification

- `cd web && bun run test`: four regression tests passed.
- `cd web && bun run lint`: passed.
- `cd web && bun run build`: passed without the former oversized-chunk warning.
- `go vet ./internal/... ./cmd/...`: passed.
- `go test -race ./internal/... ./cmd/...`: passed, including Turnstile policy and billing role regressions.
- 21st deterministic UI review: zero errors; remaining warnings concern intentional autofocus and existing primitive transitions/disabled styles.
- Impeccable mechanical detector: no findings.
- Browser checks: desktop secrets/audit and mobile navigation, secret menus, editing, owner settings, command creation, nested generator, docs deep links; twelve main routes loaded at a measured 427px viewport without page overflow or broken images. Separate secrets/dialog checks used 390px and docs/billing checks used 320px.

Live Razorpay charges and real Cloudflare challenges were not exercised. Local
browser data was created only in `/tmp/vaultkey-ui-review.db`. The root DESIGN.md
is stale relative to the implemented design system and was left unchanged.
