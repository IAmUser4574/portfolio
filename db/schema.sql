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

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email            TEXT PRIMARY KEY,
  status           TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx
  ON newsletter_subscribers (status);

-- tracks which blog slugs have already triggered a "new post" email blast,
-- independent of who is currently subscribed
CREATE TABLE IF NOT EXISTS newsletter_sent_posts (
  slug     TEXT PRIMARY KEY,
  sent_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
