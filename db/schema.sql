-- run once against your neon database to initialize view tracking tables

CREATE TABLE IF NOT EXISTS view_counts (
  slug             TEXT    PRIMARY KEY,
  total_views      INTEGER NOT NULL DEFAULT 0,
  unique_visitors  INTEGER NOT NULL DEFAULT 0
);

-- one row per (slug, visitor, calendar day) — used for daily unique-visitor dedup
CREATE TABLE IF NOT EXISTS visitor_log (
  slug          TEXT NOT NULL,
  visitor_hash  TEXT NOT NULL,
  visit_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (slug, visitor_hash, visit_date)
);
