# syntax=docker/dockerfile:1
FROM oven/bun:1-alpine AS web-build
WORKDIR /app/web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile
COPY web/ ./
RUN bun run build

FROM golang:1.26-alpine AS go-build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=web-build /app/web/dist ./web/dist
ARG VERSION=dev
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w -X vaultkey/internal/version.Version=${VERSION}" -o /bin/vaultkey-server ./cmd/server

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata \
    && adduser -D -u 10001 vaultkey \
    && mkdir -p /var/lib/vaultkey \
    && chown vaultkey:vaultkey /var/lib/vaultkey
USER vaultkey
ENV VAULTKEY_DB_PATH=/var/lib/vaultkey/vaultkey.db
COPY --from=go-build /bin/vaultkey-server /usr/local/bin/
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
ENTRYPOINT ["/usr/local/bin/vaultkey-server"]
