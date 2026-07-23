# Stage 1: Build Go Server with Embedded Web Assets
FROM golang:alpine AS go-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

# Stage 2: Minimal Production Runtime
FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=go-builder /app/server /app/server
COPY --from=go-builder /app/vaultkey.yaml /app/vaultkey.yaml
EXPOSE 8080
VOLUME ["/var/lib/vaultkey"]
ENTRYPOINT ["/app/server"]

