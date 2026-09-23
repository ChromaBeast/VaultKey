#!/usr/bin/env python3
"""Create a consistent SQLite online backup and prune old local snapshots."""

from __future__ import annotations

import argparse
import os
import sqlite3
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path


def backup_database(source_path: Path, destination_path: Path) -> None:
    if not source_path.is_file():
        raise FileNotFoundError(f"database does not exist: {source_path}")
    destination_path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    if os.name == "posix":
        os.chmod(destination_path.parent, 0o700)

    source = sqlite3.connect(str(source_path), timeout=30)
    destination = sqlite3.connect(str(destination_path), timeout=30)
    try:
        source.backup(destination)
        result = destination.execute("PRAGMA integrity_check").fetchone()
        if not result or result[0] != "ok":
            raise RuntimeError(f"SQLite integrity check failed: {result}")
    except Exception:
        destination.close()
        source.close()
        destination_path.unlink(missing_ok=True)
        raise
    else:
        destination.close()
        source.close()
        if os.name == "posix":
            os.chmod(destination_path, 0o600)


def prune_snapshots(directory: Path, keep_days: int, now: datetime) -> int:
    cutoff = now.timestamp() - timedelta(days=keep_days).total_seconds()
    removed = 0
    for path in directory.glob("vaultkey-*.sqlite3"):
        if path.is_file() and path.stat().st_mtime < cutoff:
            path.unlink()
            removed += 1
    return removed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=Path("./data/vaultkey.db"))
    parser.add_argument("--destination", type=Path, default=Path("./backups"))
    parser.add_argument("--keep-days", type=int, default=30)
    args = parser.parse_args()
    if args.keep_days < 1:
        parser.error("--keep-days must be at least 1")

    now = datetime.now(timezone.utc)
    stamp = now.strftime("%Y%m%dT%H%M%SZ")
    destination = args.destination / f"vaultkey-{stamp}.sqlite3"
    try:
        backup_database(args.database, destination)
        removed = prune_snapshots(args.destination, args.keep_days, now)
    except (OSError, sqlite3.Error, RuntimeError) as error:
        print(f"backup failed: {error}", file=sys.stderr)
        return 1

    print(f"created {destination}; removed {removed} expired snapshot(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
