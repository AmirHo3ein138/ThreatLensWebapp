CREATE TABLE scans (
    id TEXT PRIMARY KEY,
    ioc TEXT NOT NULL,
    ioc_type TEXT NOT NULL,
    refresh INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('queued','running','completed','failed','interrupted')),
    submitted_at TEXT NOT NULL,
    started_at TEXT,
    finished_at TEXT,
    report_schema_version INTEGER,
    report_json TEXT,
    report_text TEXT,
    error_code TEXT,
    error_message TEXT
);
CREATE INDEX scans_submitted ON scans(submitted_at DESC, id DESC);