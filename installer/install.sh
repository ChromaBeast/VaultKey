#!/bin/sh
# VaultKey installer.
# Downloads release binaries from GitHub, verifies SHA256 checksums,
# and optionally installs a non-root systemd service (--server).
#
# Usage:
#   install.sh [--server] [--version vX.Y.Z] [--bindir DIR]
#
# Environment overrides:
#   VAULTKEY_VERSION   release tag to install ("latest" by default)

set -eu

REPO="chromabeast/vaultkey"
INSTALL_DIR="/usr/local/bin"
SERVER_MODE=0
VERSION="${VAULTKEY_VERSION:-latest}"

while [ $# -gt 0 ]; do
  case "$1" in
    --server)
      SERVER_MODE=1
      ;;
    --version)
      [ $# -ge 2 ] || { echo "error: --version requires a value" >&2; exit 1; }
      VERSION="$2"
      shift
      ;;
    --bindir)
      [ $# -ge 2 ] || { echo "error: --bindir requires a value" >&2; exit 1; }
      INSTALL_DIR="$2"
      shift
      ;;
    *)
      echo "error: unknown option: $1" >&2
      exit 1
      ;;
  esac
  shift
done

if ! command -v curl >/dev/null 2>&1; then
  echo "error: curl is required but not installed." >&2
  echo "       Install it first, e.g.: apt-get install curl (or brew install curl)" >&2
  exit 1
fi

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$OS" in
  linux|darwin) ;;
  *) echo "error: unsupported OS: $OS" >&2; exit 1 ;;
esac

ARCH=$(uname -m)
case "$ARCH" in
  x86_64|amd64) ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "error: unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

# Agent/CLI installs run unprivileged; refuse root unless --server was
# requested (the server path needs root for systemd and /etc/vaultkey).
if [ "$(id -u)" -eq 0 ] && [ "$SERVER_MODE" -eq 0 ]; then
  echo "error: refusing to install the VaultKey agent as root." >&2
  echo "       Run this script as a regular user, or pass --server if you" >&2
  echo "       want the server installed as a system service (root required)." >&2
  exit 1
fi

BASE_URL="https://github.com/${REPO}/releases/download"

if [ "$VERSION" = "latest" ]; then
  echo "Resolving latest release..."
  VERSION=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep '"tag_name"' | head -n 1 \
    | sed 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
  [ -n "$VERSION" ] || {
    echo "error: could not resolve latest release tag from the GitHub API." >&2
    echo "       Check https://github.com/${REPO}/releases or pin one via" >&2
    echo "       --version vX.Y.Z / VAULTKEY_VERSION." >&2
    exit 1
  }
fi

echo "Installing VaultKey ${VERSION} (${OS}/${ARCH})"

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT HUP INT TERM

ASSET="vaultkey-${OS}-${ARCH}"

echo "Downloading ${ASSET}..."
curl -fsSL -o "${TMP_DIR}/${ASSET}" "${BASE_URL}/${VERSION}/${ASSET}"
curl -fsSL -o "${TMP_DIR}/checksums-sha256.txt" "${BASE_URL}/${VERSION}/checksums-sha256.txt"

EXPECTED=$(grep " ${ASSET}\$" "${TMP_DIR}/checksums-sha256.txt" | awk '{print $1}')
[ -n "$EXPECTED" ] || {
  echo "error: no checksum found for ${ASSET} in checksums-sha256.txt" >&2
  exit 1
}

if command -v sha256sum >/dev/null 2>&1; then
  ACTUAL=$(sha256sum "${TMP_DIR}/${ASSET}" | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then
  ACTUAL=$(shasum -a 256 "${TMP_DIR}/${ASSET}" | awk '{print $1}')
else
  echo "error: neither sha256sum nor shasum is available; cannot verify download" >&2
  exit 1
fi

if [ "$ACTUAL" != "$EXPECTED" ]; then
  echo "error: checksum mismatch for ${ASSET}" >&2
  echo "  expected: ${EXPECTED}" >&2
  echo "  actual:   ${ACTUAL}" >&2
  exit 1
fi
echo "Checksum OK"

SUDO=""
if [ ! -d "$INSTALL_DIR" ] || [ ! -w "$INSTALL_DIR" ]; then
  if [ "$(id -u)" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
      SUDO="sudo"
    else
      echo "error: cannot write to ${INSTALL_DIR} and sudo is unavailable." >&2
      echo "       Re-run with --bindir pointing at a writable directory." >&2
      exit 1
    fi
  fi
fi

$SUDO mkdir -p "$INSTALL_DIR"
$SUDO install -m 0755 "${TMP_DIR}/${ASSET}" "${INSTALL_DIR}/vaultkey"

if [ "$SERVER_MODE" -eq 1 ]; then
  if [ "$OS" != "linux" ]; then
    echo "error: --server is only supported on Linux (requires systemd)" >&2
    exit 1
  fi
  if [ "$ARCH" != "amd64" ]; then
    echo "error: server release assets are currently published for" >&2
    echo "       linux/amd64 only; no asset exists for linux/${ARCH}." >&2
    exit 1
  fi
  if [ "$(id -u)" -ne 0 ]; then
    echo "error: --server installation requires root (writes the systemd" >&2
    echo "       unit and /etc/vaultkey/env)" >&2
    exit 1
  fi

  SERVER_ASSET="server-${OS}-${ARCH}"
  echo "Downloading ${SERVER_ASSET}..."
  curl -fsSL -o "${TMP_DIR}/${SERVER_ASSET}" "${BASE_URL}/${VERSION}/${SERVER_ASSET}"

  EXPECTED=$(grep " ${SERVER_ASSET}\$" "${TMP_DIR}/checksums-sha256.txt" | awk '{print $1}')
  [ -n "$EXPECTED" ] || {
    echo "error: no checksum found for ${SERVER_ASSET} in checksums-sha256.txt" >&2
    exit 1
  }
  ACTUAL=$(sha256sum "${TMP_DIR}/${SERVER_ASSET}" | awk '{print $1}')
  [ "$ACTUAL" = "$EXPECTED" ] || {
    echo "error: checksum mismatch for ${SERVER_ASSET}" >&2
    echo "  expected: ${EXPECTED}" >&2
    echo "  actual:   ${ACTUAL}" >&2
    exit 1
  }
  echo "Server checksum OK"

  install -m 0755 "${TMP_DIR}/${SERVER_ASSET}" "/usr/local/bin/vaultkey-server"

  mkdir -p /etc/vaultkey
  if [ ! -f /etc/vaultkey/env ]; then
    echo "Generating /etc/vaultkey/env with a random audit signing key..."
    {
      printf 'VAULTKEY_ENV=production\n'
      printf 'VAULTKEY_DB_PATH=/var/lib/vaultkey/vaultkey.db\n'
      printf 'VAULTKEY_AUTO_LOCK=30m\n'
    } > /etc/vaultkey/env
    if command -v openssl >/dev/null 2>&1; then
      HMAC_KEY="$(openssl rand -hex 32)"
    else
      HMAC_KEY="$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')"
    fi
    printf 'VAULTKEY_HMAC_KEY=%s\n' "$HMAC_KEY" >> /etc/vaultkey/env
    chmod 600 /etc/vaultkey/env
  else
    echo "Reusing existing /etc/vaultkey/env"
  fi

  cat > /etc/systemd/system/vaultkey.service <<EOF
[Unit]
Description=VaultKey Secrets Server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
DynamicUser=yes
StateDirectory=vaultkey
EnvironmentFile=/etc/vaultkey/env
ExecStart=/usr/local/bin/vaultkey-server
Restart=always
RestartSec=5
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload || true
  systemctl enable vaultkey.service || true
fi

echo ""
echo "Installation complete."
echo "  Binary : ${INSTALL_DIR}/vaultkey (${VERSION}, ${OS}/${ARCH})"
if [ "$SERVER_MODE" -eq 1 ]; then
  echo "  Server : /usr/local/bin/vaultkey-server"
  echo "           start it with: systemctl start vaultkey"
  echo "           health check : GET http://127.0.0.1:8080/healthz"
fi
