import os
import urllib.parse
import urllib.request
import json

class Vaultkey:
    def __init__(self, api_key: str, host: str = "http://localhost:8080"):
        self.host = host.rstrip("/")
        self.api_key = api_key

    def _request(self, path: str, method: str = "GET", data: dict = None) -> dict:
        url = f"{self.host}{path}"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        req_data = None
        if data is not None:
            req_data = json.dumps(data).encode("utf-8")
            
        req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
        
        try:
            with urllib.request.urlopen(req) as res:
                body = res.read().decode("utf-8")
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8")
            try:
                msg = json.loads(err_body).get("error", str(e))
            except Exception:
                msg = str(e)
            raise Exception(f"VaultKey request failed: {msg} (status: {e.code})")

    def get(self, key: str, project: str = "default", env: str = "production") -> str:
        """Retrieves a single decrypted secret value."""
        path = f"/v1/secrets/{urllib.parse.quote(key)}?project={urllib.parse.quote(project)}&environment={urllib.parse.quote(env)}"
        res = self._request(path)
        return res.get("value", "")

    def list(self, project: str = "default", env: str = "production") -> list:
        """Lists active secret keys and metadata."""
        path = f"/v1/secrets?project={urllib.parse.quote(project)}&environment={urllib.parse.quote(env)}"
        return self._request(path)

    def values(self, project: str = "default", env: str = "production") -> dict:
        """Retrieves all decrypted secrets in the scope as a dictionary."""
        path = f"/v1/secrets/values?project={urllib.parse.quote(project)}&environment={urllib.parse.quote(env)}"
        return self._request(path)

    def inject(self, project: str = "default", env: str = "production") -> None:
        """Fetches all active secrets and injects them into os.environ in-memory."""
        secrets = self.values(project, env)
        for k, v in secrets.items():
            os.environ[k] = v
