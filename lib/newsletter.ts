import { getDb } from "@/lib/db";
import { getBlogPosts } from "@/lib/blog";
import { sendEmail } from "@/lib/mailgun";
import { siteUrl } from "@/lib/site-url";
import { normalizeEmail, signUnsubscribeToken } from "@/lib/newsletter-token";
import { renderNewPostEmail, renderWelcomeEmail } from "@/lib/newsletter-email";

async function unsubscribeUrlFor(email: string): Promise<string> {
  const token = await signUnsubscribeToken(email);
  return `${siteUrl()}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

// on the very first subscriber ever, mark every currently-published post as
// already sent — otherwise the first send-new-posts run would blast the
// entire back catalog at whoever happens to be subscribed by then. only
// fires while newsletter_sent_posts is empty, so it never suppresses a real
// new post once the table has any rows
async function seedSentPostsIfEmpty(): Promise<void> {
  const sql = getDb();
  const existing = await sql`SELECT slug FROM newsletter_sent_posts LIMIT 1`;
  if (existing.length > 0) return;

  for (const post of await getBlogPosts()) {
    await markPostSent(post.slug);
  }
}

// subscribes (or reactivates) an email and sends the welcome email. always
// re-sends on every call rather than branching on new-vs-existing — simpler,
// and a duplicate welcome email on a double-submit is harmless
export async function subscribe(email: string): Promise<void> {
  const sql = getDb();
  const normalized = normalizeEmail(email);

  try {
    await seedSentPostsIfEmpty();
  } catch (err) {
    console.error("[newsletter] seeding sent-posts failed:", err);
  }

  await sql`
    INSERT INTO newsletter_subscribers (email, status, subscribed_at, unsubscribed_at)
    VALUES (${normalized}, 'active', now(), NULL)
    ON CONFLICT (email) DO UPDATE
      SET status = 'active', subscribed_at = now(), unsubscribed_at = NULL
  `;

  try {
    const unsubscribeUrl = await unsubscribeUrlFor(normalized);
    const { subject, html } = renderWelcomeEmail(unsubscribeUrl);
    await sendEmail({ to: normalized, subject, html });
  } catch (err) {
    // the subscription itself succeeded — don't fail the signup just
    // because the welcome email couldn't be sent
    console.error(`[newsletter] welcome email failed for ${normalized.slice(0, 3)}:`, err);
  }
}

export async function unsubscribe(email: string): Promise<void> {
  const sql = getDb();
  const normalized = normalizeEmail(email);

  await sql`
    UPDATE newsletter_subscribers
    SET status = 'unsubscribed', unsubscribed_at = now()
    WHERE email = ${normalized}
  `;
}

export async function getActiveSubscribers(): Promise<string[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT email FROM newsletter_subscribers WHERE status = 'active' ORDER BY email
  `;
  return rows.map((r) => r.email as string);
}

export async function getSentSlugs(): Promise<Set<string>> {
  const sql = getDb();
  const rows = await sql`SELECT slug FROM newsletter_sent_posts`;
  return new Set(rows.map((r) => r.slug as string));
}

export async function markPostSent(slug: string): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO newsletter_sent_posts (slug) VALUES (${slug})
    ON CONFLICT (slug) DO NOTHING
  `;
}

// diffs published posts against what's already been sent, and emails every
// active subscriber for each newly-published post (oldest-unsent-first, so
// subscribers get multiple new posts in order if more than one shipped
// between deploys)
export async function sendNewPostNotifications(): Promise<{
  processedSlugs: string[];
  subscriberCount: number;
}> {
  const posts = await getBlogPosts();
  const sent = await getSentSlugs();
  const newPosts = posts.filter((p) => !sent.has(p.slug)).reverse();

  if (newPosts.length === 0) {
    return { processedSlugs: [], subscriberCount: 0 };
  }

  const subscribers = await getActiveSubscribers();

  for (const post of newPosts) {
    for (const email of subscribers) {
      try {
        const unsubscribeUrl = await unsubscribeUrlFor(email);
        const { subject, html } = renderNewPostEmail(post, unsubscribeUrl);
        await sendEmail({ to: email, subject, html });
      } catch (err) {
        // one bad/bounced address must not abort the whole batch
        console.error(`[newsletter] send failed for ${email.slice(0, 3)}:`, err);
      }
    }

    // mark sent even with partial per-recipient failures — this is a personal
    // blog, not a mission-critical mailer, and a stuck "unsent" slug would
    // otherwise re-email everyone on every future deploy
    await markPostSent(post.slug);
  }

  return {
    processedSlugs: newPosts.map((p) => p.slug),
    subscriberCount: subscribers.length,
  };
}
