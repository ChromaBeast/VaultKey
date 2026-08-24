#!/bin/bash
# =============================================================
# VaultKey VPS Bootstrap Script
# Run this ONCE on your VPS to set everything up.
# After this, all future deploys happen automatically via
# Watchtower (no SSH needed from CI/CD).
#
# Usage:
#   chmod +x bootstrap.sh
#   ./bootstrap.sh <GITHUB_USERNAME> <GITHUB_PAT>
#
# GITHUB_PAT needs scope: read:packages
# Create one at: https://github.com/settings/tokens/new
# =============================================================
set -euo pipefail

GITHUB_USERNAME="${1:?Usage: ./bootstrap.sh <GITHUB_USERNAME> <GITHUB_PAT>}"
GITHUB_PAT="${2:?Usage: ./bootstrap.sh <GITHUB_USERNAME> <GITHUB_PAT>}"

echo ""
echo "==================================================="
echo "  VaultKey VPS Bootstrap"
echo "==================================================="

# 1. Install Docker if not present
if ! command -v docker >/dev/null 2>&1; then
  echo ""
  echo "[1/6] Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
  echo "  [OK] Docker installed"
  echo "  NOTE: docker group membership only takes effect after a re-login."
  echo "        Log out and back in (or run: newgrp docker) before using"
  echo "        Docker without sudo."
else
  echo "[1/6] Docker already installed: $(docker --version)"
fi

# 2. Ensure Docker Compose v2 plugin is available
if ! docker compose version >/dev/null 2>&1; then
  echo ""
  echo "[2/6] Installing Docker Compose plugin..."
  sudo apt-get update -qq
  sudo apt-get install -y docker-compose-plugin
  echo "  [OK] Docker Compose installed"
else
  echo "[2/6] Docker Compose already installed: $(docker compose version)"
fi

# 3. Create app directory
echo ""
echo "[3/6] Creating /opt/vaultkey directory..."
sudo mkdir -p /opt/vaultkey/data
sudo chown -R "$USER:$USER" /opt/vaultkey
echo "  [OK] Directory ready"

# 4. Log in to ghcr.io (needed for Watchtower to pull future images)
echo ""
echo "[4/6] Logging into GitHub Container Registry..."
mkdir -p "$HOME/.docker"
echo "$GITHUB_PAT" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin
# Save credentials where Watchtower expects them
sudo mkdir -p /root/.docker
sudo cp "$HOME/.docker/config.json" /root/.docker/config.json
echo "  [OK] Logged in"
echo "  WARNING: Your PAT is stored base64-encoded (not encrypted) in"
echo "           ~/.docker/config.json and /root/.docker/config.json."
echo "           Anyone with root access to this host can recover it."
echo "           Use a token with only the read:packages scope."

# 5. Copy the compose files and create .env
echo ""
echo "[5/6] Setting up docker-compose.yml, Caddyfile, .env..."
if [ -f "./docker-compose.yml" ]; then
  cp docker-compose.yml Caddyfile vaultkey.yaml /opt/vaultkey/
  [ -f "./.env.example" ] && cp .env.example /opt/vaultkey/
  echo "  [OK] Config files copied"
else
  echo "  WARNING: docker-compose.yml not found in current directory."
  echo "           Please copy docker-compose.yml, Caddyfile, and"
  echo "           vaultkey.yaml to /opt/vaultkey/ manually, then run:"
  echo "           cd /opt/vaultkey && docker compose up -d"
  exit 1
fi

# The compose file requires an audit HMAC signing key via .env;
# generate one automatically on first setup.
if [ ! -f /opt/vaultkey/.env ]; then
  if command -v openssl >/dev/null 2>&1; then
    HMAC_KEY="$(openssl rand -hex 32)"
  else
    HMAC_KEY="$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')"
  fi
  printf 'VAULTKEY_HMAC_KEY=%s\n' "$HMAC_KEY" > /opt/vaultkey/.env
  chmod 600 /opt/vaultkey/.env
  echo "  [OK] Generated /opt/vaultkey/.env with a random audit signing key"
fi

# 6. Pull images and start all containers
echo ""
echo "[6/6] Pulling images and starting containers..."
cd /opt/vaultkey
docker pull ghcr.io/chromabeast/vaultkey:latest
docker compose up -d

echo ""
echo "==================================================="
echo "  [OK] Bootstrap complete!"
echo "==================================================="
echo ""
echo "Containers running:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "  Web UI : https://vaultkey.sheershjaiswal.in"
echo "  API    : https://api.vaultkey.sheershjaiswal.in"
echo "           (requires DNS pointing at this host;"
echo "            TLS certificates are issued automatically by Caddy)"
echo ""
echo "  Watchtower polls ghcr.io every 5 min."
echo "  Future pushes to main auto-deploy within 5 min!"
echo ""
echo "  To view logs: docker compose -f /opt/vaultkey/docker-compose.yml logs -f"
