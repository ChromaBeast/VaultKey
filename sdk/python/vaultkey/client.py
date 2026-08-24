import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Optional

_RETRY_DELAYS = (0.3, 0.9)


def _extract_http_error(e: urllib.error.HTTPError) -> str:
    try:
        body = e.read().decode("utf-8")
        return json.loads(body).get("error", str(e))
    except Exception:
        return str(e)


class Vaultkey:
    def __init__(self, api_key: str, host: str = "http://localhost:8080", timeout: float = 30.0):
        if not api_key or not isinstance(api_key, str):
            raise ValueError("api_key must be a non-empty string")
        self.host = host.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout

    def _send(self, path: str, method: str, data: Optional[dict]) -> Any:
        req = urllib.request.Request(
            f"{self.host}{path}",
            data=json.dumps(data).encode("utf-8") if data is not None else None,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            method=method,
        )
        with urllib.request.urlopen(req, timeout=self.timeout) as res:
            body = res.read().decode("utf-8")
        return json.loads(body) if body else {}

    def _request(self, path: str, method: str = "GET", data: Optional[dict] = None) -> Any:
        last_error = ""
        for attempt in range(len(_RETRY_DELAYS) + 1):
            if attempt:
                time.sleep(_RETRY_DELAYS[attempt - 1])
            try:
                return self._send(path, method, data)
            except urllib.error.HTTPError as e:
                last_error = f"{_extract_http_error(e)} (status: {e.code})"
                if e.code < 500:
                    break
            except urllib.error.URLError as e:
                last_error = f"{e.reason} (connection failed)"
        raise Exception(f"VaultKey request failed: {last_error}")

    def get(self, key: str, project: str = "default", env: str = "production") -> str:
        """Retrieves a single decrypted secret value."""
        path = f"/v1/secrets/{urllib.parse.quote(key)}?project={urllib.parse.quote(project)}&environment={urllib.parse.quote(env)}"
        res = self._request(path)
        if not isinstance(res, dict) or "value" not in res:
            raise Exception(f"secret '{key}' not found")
        return res["value"]

    def list(self, project: str = "default", env: str = "production") -> list:
        """Lists active secret keys and metadata."""
        path = f"/v1/secrets?project={urllib.parse.quote(project)}&environment={urllib.parse.quote(env)}"
        res = self._request(path)
        return res if isinstance(res, list) else []

    def values(self, project: str = "default", env: str = "production") -> dict:
        """Retrieves all decrypted secrets in the scope as a dictionary."""
        path = f"/v1/secrets/values?project={urllib.parse.quote(project)}&environment={urllib.parse.quote(env)}"
        res = self._request(path)
        return res if isinstance(res, dict) else {}

    def inject(
        self,
        project: str = "default",
        env: str = "production",
        override: bool = True,
    ) -> dict:
        """Fetches all active secrets, sets them into os.environ in-memory, and returns the mapping.

        With override=False, keys already present in os.environ are skipped.
        """
        secrets = self.values(project, env)
        for k, v in secrets.items():
            if not override and k in os.environ:
                continue
            os.environ[k] = v
        return secrets
