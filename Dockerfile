# Production Runtime for Pre-compiled VaultKey Server
FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY server /app/server
COPY vaultkey.yaml /app/vaultkey.yaml
EXPOSE 8080
VOLUME ["/var/lib/vaultkey"]
ENTRYPOINT ["/app/server"]
