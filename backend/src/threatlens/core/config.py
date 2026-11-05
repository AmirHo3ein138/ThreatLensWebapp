"""Runtime configuration loaded explicitly; no import-time filesystem effects."""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import dotenv_values

VERSION = "2.2.0"
REQUEST_TIMEOUT = 12
PROVIDERS = {
    "virustotal": ("VirusTotal", "VT_API_KEY"),
    "otx": ("AlienVault OTX", "OTX_API_KEY"),
    "threatfox": ("ThreatFox", "THREATFOX_API_KEY"),
    "abuseipdb": ("AbuseIPDB", "ABUSEIPDB_API_KEY"),
    "urlhaus": ("URLhaus", "URLHAUS_API_KEY"),
    "malwarebazaar": ("MalwareBazaar", "MALWAREBAZAAR_API_KEY"),
    "pulsedive": ("Pulsedive", "PULSEDIVE_API_KEY"),
}


@dataclass(frozen=True)
class AppConfig:
    keys: dict
    data_dir: Path
    org_file: Path | None = None
    timeout: float = REQUEST_TIMEOUT
    cache_ttl: int = 3600
    negative_ttl: int = 300
    context_ttl: int = 86400
    offline: bool = False
    no_cache: bool = False
    enrichment: bool = True
    whois_api_key: str | None = None

    @property
    def secrets(self):
        return [*self.keys.values(), self.whois_api_key]


def application_dir() -> Path:
    """Backend directory for this source checkout / editable installation.

    Webapp paths intentionally replace the legacy frozen EXE layout: credentials
    default to backend/.env and runtime files to the repository data/ directory.
    """
    return Path(__file__).resolve().parents[3]


def _configured_path(value: str, base: Path) -> Path:
    path = Path(value).expanduser()
    return (path if path.is_absolute() else base / path).resolve()


def load_config(env_file=None, **overrides) -> AppConfig:
    if env_file is not None:
        env_path = Path(env_file).expanduser().resolve()
    else:
        env_path = application_dir() / ".env"
    # Keep file values local so switching --env-file never inherits old keys.
    source = {**dotenv_values(env_path), **os.environ}
    org = source.get("THREATLENS_ORG_FILE")
    data = source.get("THREATLENS_DATA_DIR")
    values = dict(
        keys={name: (source.get(env) or "").strip() for name, (_, env) in PROVIDERS.items()},
        data_dir=_configured_path(data, env_path.parent)
        if data
        else application_dir().parent / "data",
        org_file=_configured_path(org, env_path.parent) if org else None,
        whois_api_key=source.get("WHOIS_API_KEY"),
    )
    values.update({k: v for k, v in overrides.items() if v is not None})
    return AppConfig(**values)
