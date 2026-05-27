import { sql } from "@/lib/db";

export type ViewCounts = { views: number; unique: number };

// sha-256 of ip:userAgent — never store raw ip
async function hashVisitor(ip: string, userAgent: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${ip}:${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// record a page view and return the updated counts for that slug
export async function recordView(
  slug: string,
  ip: string,
  userAgent: string
): Promise<ViewCounts> {
  const visitorHash = await hashVisitor(ip, userAgent);

  // insert into visitor_log; ON CONFLICT DO NOTHING means duplicate = returning nothing
  const inserted = await sql`
    INSERT INTO visitor_log (slug, visitor_hash, visit_date)
    VALUES (${slug}, ${visitorHash}, CURRENT_DATE)
    ON CONFLICT DO NOTHING
    RETURNING slug
  `;

  const isNewUniqueVisit = inserted.length > 0;

  const [row] = await sql`
    INSERT INTO view_counts (slug, total_views, unique_visitors)
    VALUES (${slug}, 1, ${isNewUniqueVisit ? 1 : 0})
    ON CONFLICT (slug) DO UPDATE
      SET total_views     = view_counts.total_views + 1,
          unique_visitors = view_counts.unique_visitors + ${isNewUniqueVisit ? 1 : 0}
    RETURNING total_views, unique_visitors
  `;

  return { views: row.total_views, unique: row.unique_visitors };
}

// batch fetch counts for a list of slugs; missing slugs get zeros
export async function getViewCounts(
  slugs: string[]
): Promise<Record<string, ViewCounts>> {
  if (slugs.length === 0) return {};

  const rows = await sql`
    SELECT slug, total_views, unique_visitors
    FROM view_counts
    WHERE slug = ANY(${slugs})
  `;

  const result: Record<string, ViewCounts> = {};
  for (const slug of slugs) result[slug] = { views: 0, unique: 0 };
  for (const r of rows) result[r.slug] = { views: r.total_views, unique: r.unique_visitors };

  return result;
}
