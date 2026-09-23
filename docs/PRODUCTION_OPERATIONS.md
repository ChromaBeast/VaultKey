# Production Operations

## Required configuration

The production server refuses to start without a strong `VAULTKEY_HMAC_KEY`, real Cloudflare Turnstile site and secret keys, and a working email provider configuration. The Turnstile widget is rendered on sign-up and login; the public site key is served by `/v1/auth/config`. Production rejects the console email provider because it logs password-reset OTPs.

Recurring billing is disabled when its settings are all blank. To enable it, set all five `RAZORPAY_*` values in `.env`: API key ID, API secret, webhook secret, Pro plan ID, and Enterprise plan ID. Use plan IDs created in the matching Razorpay account. Partial billing configuration is rejected at startup. Keep `.env` readable only by the deployment operator.

## SQLite backups

The Compose deployment stores its database in `./data/vaultkey.db`. Create an online, integrity-checked snapshot with Python 3:

```sh
python3 scripts/backup_sqlite.py --database ./data/vaultkey.db --destination ./backups --keep-days 30
```

Schedule that command daily and copy snapshots to a separate host or backup service with encryption and restricted access. The script only keeps local snapshots; it does not configure an off-site destination. Keep the HMAC signing key and deployment configuration in a separate, access-controlled recovery store. Do not put either in the database backup directory.

Before relying on a backup, restore a copy to a clean instance, confirm `/healthz`, log in, retrieve a test secret, and verify the audit chain. Record the tested restore date and the steps needed to recover the HMAC key and provider settings.

## Deployment and monitoring

When GitHub SSH deployment secrets are configured, the workflow waits for the API health endpoint and fails if the rollout does not become healthy. Without them, deployment is deferred to Watchtower and is not synchronously confirmed by CI. Configure an external uptime monitor for the public site and `/healthz`, alert on restart loops and repeated auth/email/payment failures, and retain server and reverse-proxy logs according to the service's published retention policy.

## Launch decisions still owned by the service operator

- Configure and verify the real Turnstile, Razorpay, email, domain, and TLS settings for the production host.
- Publish reviewed Terms of Service and a complete privacy notice, including the legal service-provider identity, retention/deletion timelines, billing/refund terms, and support/security contact channels.
- Complete a production restore drill and a security review before inviting customers to store production credentials.
