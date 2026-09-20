# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────
# VaultKey web UI image (frontend only).
# Builds the Vite/React SPA with Bun and serves the static
# output via nginx. Deploys independently from the Go API
# image (see root Dockerfile). API calls go to /v1/*, which
# the edge proxy (Caddy) routes to the vaultkey server.
# ─────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS build
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]