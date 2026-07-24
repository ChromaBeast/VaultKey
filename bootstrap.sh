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
if ! command -v docker &>/dev/null; then
  echo ""
  echo "[1/6] Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
  echo "  ✅ Docker installed"
else
  echo "[1/6] Docker already installed: $(docker --version)"
fi

# 2. Ensure Docker Compose v2 plugin is available
if ! docker compose version &>/dev/null; then
  echo ""
  echo "[2/6] Installing Docker Compose plugin..."
  sudo apt-get update -qq
  sudo apt-get install -y docker-compose-plugin
  echo "  ✅ Docker Compose installed"
else
  echo "[2/6] Docker Compose already installed: $(docker compose version)"
fi

# 3. Create app directory
echo ""
echo "[3/6] Creating /opt/vaultkey directory..."
sudo mkdir -p /opt/vaultkey/data
sudo chown -R "$USER:$USER" /opt/vaultkey
echo "  ✅ Directory ready"

# 4. Log in to ghcr.io (needed for Watchtower to pull future images)
echo ""
echo "[4/6] Logging into GitHub Container Registry..."
echo "$GITHUB_PAT" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin
# Save credentials where Watchtower expects them
sudo mkdir -p /root/.docker
sudo cp ~/.docker/config.json /root/.docker/config.json
echo "  ✅ Logged in — credentials saved for Watchtower"

# 5. Copy the compose files
echo ""
echo "[5/6] Setting up docker-compose.yml, Caddyfile..."
# If running from the repo dir, files are already here.
# If not, copy them manually to /opt/vaultkey/ first.
if [ -f "./docker-compose.yml" ]; then
  cp docker-compose.yml Caddyfile vaultkey.yaml /opt/vaultkey/
  echo "  ✅ Config files copied"
else
  echo "  ⚠️  docker-compose.yml not found in current directory."
  echo "     Please copy docker-compose.yml, Caddyfile, and vaultkey.yaml"
  echo "     to /opt/vaultkey/ manually, then run:"
  echo "     cd /opt/vaultkey && docker compose up -d"
  exit 1
fi

# 6. Pull images and start all containers
echo ""
echo "[6/6] Pulling images and starting containers..."
cd /opt/vaultkey
docker pull ghcr.io/chromabeast/vaultkey:latest
docker compose up -d

echo ""
echo "==================================================="
echo "  ✅ Bootstrap complete!"
echo "==================================================="
echo ""
echo "Containers running:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "  🌐 Web UI  → http://$(curl -s ifconfig.me):8080"
echo "  📦 Once DNS is configured:"
echo "       https://vaultkey.sheershjaiswal.in"
echo "       https://api.vaultkey.sheershjaiswal.in"
echo ""
echo "  🔄 Watchtower polls ghcr.io every 5 min."
echo "     Future pushes to main auto-deploy within 5 min!"
echo ""
echo "  📋 To view logs: docker compose -f /opt/vaultkey/docker-compose.yml logs -f"
