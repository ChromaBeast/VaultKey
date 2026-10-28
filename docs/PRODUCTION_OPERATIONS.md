# Production Operations

## Required configuration

The production server refuses to start without a strong `VAULTKEY_HMAC_KEY`, real Cloudflare Turnstile site and secret keys, and a working email provider configuration. The Turnstile widget is rendered on sign-up and login; the public site key is served by `/v1/auth/config`. Production rejects the console email provider because it logs password-reset OTPs.

Recurring billing is disabled when its settings are all blank. To enable it, set all five `RAZORPAY_*` values in `.env`: API key ID, API secret, webhook secret, Pro plan ID, and Enterprise plan ID. Use plan IDs created in the matching Razorpay account. Partial billing configuration is rejected at startup. Keep `.env` readable only by the deployment operator.

## SQLite backups

The Compose deployment stores its database in `./data/vaultkey.db`. A single VPS disk is the whole business, so run continuous off-site replication:

1. Create a private S3-compatible bucket (Cloudflare R2, Backblaze B2 or AWS S3) and an access key scoped to it.
2. Fill in the `LITESTREAM_*` values in `.env` and set `COMPOSE_PROFILES=backup`.
3. Run `docker compose up -d`. The `litestream` sidecar streams WAL changes within seconds and keeps 30 days of snapshots (`litestream.yml`).

Restore onto a clean host with:

```sh
docker run --rm -v "$PWD/data:/var/lib/vaultkey" -v "$PWD/litestream.yml:/etc/litestream.yml:ro" --env-file .env litestream/litestream:0.3.13 restore /var/lib/vaultkey/vaultkey.db
```

For an extra local snapshot (for example before an upgrade), run:

```sh
python3 scripts/backup_sqlite.py --database ./data/vaultkey.db --destination ./backups --keep-days 30
```

Keep the HMAC signing key and deployment configuration in a separate, access-controlled recovery store. Do not put either in the database backup bucket.

Before relying on a backup, restore a copy to a clean instance, confirm `/healthz`, log in, retrieve a test secret, and verify the audit chain. Record the tested restore date and the steps needed to recover the HMAC key and provider settings.

## Deployment and monitoring

When GitHub SSH deployment secrets are configured, the workflow waits for the API health endpoint and fails if the rollout does not become healthy. Without them, deployment is deferred to Watchtower and is not synchronously confirmed by CI. Configure an external uptime monitor for the public site and `/healthz`, alert on restart loops and repeated auth/email/payment failures, and retain server and reverse-proxy logs according to the service's published retention policy.

## Launch decisions still owned by the service operator

- Configure and verify the real Turnstile, Razorpay, email, domain, and TLS settings for the production host.
- Fill in the legal entity, address and support contact in `web/src/lib/legal.ts` (shown on `/terms`, `/refunds` and `/contact`; Razorpay's website review checks these), and have the Terms, Privacy and Refund pages reviewed.
- API tokens created before token-unwrap support cannot reopen an idle-locked vault. Ask existing users to rotate CI tokens once after upgrading.
- Complete a production restore drill and a security review before inviting customers to store production credentials.
