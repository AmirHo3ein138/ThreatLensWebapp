"""Small SQLite repository with one connection per operation."""

import sqlite3
from contextlib import contextmanager
from pathlib import Path


class History:
    def __init__(self, path: Path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.connection() as db:
            db.execute("PRAGMA journal_mode=WAL")
            version = db.execute("PRAGMA user_version").fetchone()[0]
            if version > 1:
                raise ValueError("History database needs a newer application version")
            if version == 0:
                migration = Path(__file__).parent / "migrations" / "001_initial.sql"
                db.executescript(
                    "BEGIN IMMEDIATE;\n"
                    + migration.read_text(encoding="utf-8")
                    + "\nPRAGMA user_version=1;\nCOMMIT;"
                )

    @contextmanager
    def connection(self):
        db = sqlite3.connect(self.path, timeout=5)
        db.row_factory = sqlite3.Row
        try:
            with db:
                yield db
        finally:
            db.close()