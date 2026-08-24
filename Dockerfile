# syntax=docker/dockerfile:1
# Build stage expects web/dist/* to exist in the build context
# (embed.go requires it; deploy.yml runs the web build first).
FROM golang:1.26-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /bin/vaultkey-server ./cmd/server

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata \
    && adduser -D -u 10001 vaultkey \
    && mkdir -p /var/lib/vaultkey \
    && chown vaultkey:vaultkey /var/lib/vaultkey
USER vaultkey
ENV VAULTKEY_DB_PATH=/var/lib/vaultkey/vaultkey.db
COPY --from=build /bin/vaultkey-server /usr/local/bin/
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
ENTRYPOINT ["/usr/local/bin/vaultkey-server"]
