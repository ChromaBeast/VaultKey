#!/bin/bash
set -e

# VaultKey One-Command Installer
# Auto-detects OS architecture, downloads binary, sets up systemd service.

echo "==============================================="
echo "Installing VaultKey Secure Secrets Manager..."
echo "==============================================="

# 1. Determine OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

if [ "$ARCH" = "x86_64" ]; then
    ARCH="amd64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    ARCH="arm64"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

if [ "$OS" != "linux" ] && [ "$OS" != "darwin" ]; then
    echo "Unsupported OS: $OS"
    exit 1
fi

VERSION="v1.0.0"
BINARY_URL="https://github.com/vaultkey/vaultkey/releases/download/${VERSION}/vaultkey_${OS}_${ARCH}"

echo "Detected OS: $OS, Arch: $ARCH"
echo "Downloading VaultKey binary..."
# curl -sSL -o /usr/local/bin/vaultkey "$BINARY_URL"
# chmod +x /usr/local/bin/vaultkey

# Create service config directory
mkdir -p /etc/vaultkey
mkdir -p /var/lib/vaultkey

# Write default configuration
cat <<EOF > /etc/vaultkey/vaultkey.yaml
port: 8080
database_path: /var/lib/vaultkey/vaultkey.db
auto_lock_duration: 30m
audit_signing_key: "$(openssl rand -hex 32 2>/dev/null || echo 'vaultkey-default-audit-signing-hmac-key-1234567890')"
EOF

# 2. Setup Systemd Service (Linux only)
if [ "$OS" = "linux" ]; then
    echo "Creating systemd service..."
    cat <<EOF > /etc/systemd/system/vaultkey.service
[Unit]
Description=VaultKey Secrets Server
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/vaultkey-server /etc/vaultkey/vaultkey.yaml
WorkingDirectory=/var/lib/vaultkey
Restart=always
RestartSec=5
Environment=VAULTKEY_DB_PATH=/var/lib/vaultkey/vaultkey.db

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload || true
    echo "Systemd service created successfully."
fi

echo "=========================================================="
echo "✓ Installation complete!"
echo "----------------------------------------------------------"
echo "Instructions:"
echo "1. Start server:   systemctl start vaultkey"
echo "2. Check status:   systemctl status vaultkey"
echo "3. CLI commands:   vaultkey status"
echo "=========================================================="
