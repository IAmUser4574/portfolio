import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db");
vi.mock("@/lib/blog");
vi.mock("@/lib/mailgun");
vi.mock("@/lib/newsletter-token", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/newsletter-token")>();
  return {
    ...actual,
    signUnsubscribeToken: vi.fn().mockResolvedValue("mock-token"),
  };
});

import { getDb } from "@/lib/db";
import { getBlogPosts } from "@/lib/blog";
import { sendEmail } from "@/lib/mailgun";
import {
  getActiveSubscribers,
  getSentSlugs,
  markPostSent,
  sendNewPostNotifications,
  subscribe,
  unsubscribe,
} from "@/lib/newsletter";

const mockGetBlogPosts = vi.mocked(getBlogPosts);
const mockSendEmail = vi.mocked(sendEmail);
const mockGetDb = vi.mocked(getDb);

// the neon client is used as a tagged template: sql`...`. a plain mock
// function receiving (strings, ...values) and resolving to rows works fine
// as a stand-in since template invocation is just a function call.
function mockSqlReturning(rows: unknown[]) {
  const sql = vi.fn().mockResolvedValue(rows);
  // @ts-expect-error - test double, not the real NeonQueryFunction type
  mockGetDb.mockReturnValue(sql);
  return sql;
}

const post = (overrides: Partial<{ slug: string; title: string; excerpt: string }> = {}) => ({
  slug: "post-a",
  title: "Post A",
  excerpt: "Excerpt A",
  publishedAt: "2024-01-01",
  readingTime: "1 min",
  tags: [],
  Component: () => null,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("subscribe / unsubscribe", () => {
  beforeEach(() => {
    // newsletter_sent_posts already has rows in most of these tests, so the
    // seed-on-first-subscriber path is a no-op unless a test overrides this
    mockGetBlogPosts.mockResolvedValue([]);
  });

  it("subscribe upserts the row and sends a welcome email", async () => {
    const sql = mockSqlReturning([{ slug: "already-sent" }]);
    await subscribe("Foo@Example.com");

    expect(sql).toHaveBeenCalled();
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "foo@example.com" })
    );
  });

  it("subscribe swallows a welcome-email failure without throwing", async () => {
    mockSqlReturning([{ slug: "already-sent" }]);
    mockSendEmail.mockRejectedValueOnce(new Error("mailgun down"));

    await expect(subscribe("foo@example.com")).resolves.toBeUndefined();
  });

  it("unsubscribe updates the row for the normalized email", async () => {
    const sql = mockSqlReturning([]);
    await unsubscribe("Foo@Example.com");
    expect(sql).toHaveBeenCalled();
  });

  it("seeds newsletter_sent_posts with existing posts on the very first subscriber", async () => {
    mockGetBlogPosts.mockResolvedValue([
      post({ slug: "old-post-1" }),
      post({ slug: "old-post-2" }),
    ]);

    const sql = vi.fn();
    sql
      .mockResolvedValueOnce([]) // seed check: table is empty
      .mockResolvedValue([]); // markPostSent x2 + subscriber upsert
    // @ts-expect-error - test double
    mockGetDb.mockReturnValue(sql);

    await subscribe("foo@example.com");

    const insertedValues = sql.mock.calls.flatMap(([, ...values]) => values);
    expect(insertedValues).toEqual(expect.arrayContaining(["old-post-1", "old-post-2"]));
  });

  it("does not reseed once newsletter_sent_posts already has rows", async () => {
    mockGetBlogPosts.mockResolvedValue([post({ slug: "old-post-1" })]);

    const sql = vi.fn();
    sql
      .mockResolvedValueOnce([{ slug: "already-sent" }]) // seed check: table already has a row
      .mockResolvedValue([]);
    // @ts-expect-error - test double
    mockGetDb.mockReturnValue(sql);

    await subscribe("foo@example.com");

    const insertedValues = sql.mock.calls.flatMap(([, ...values]) => values);
    expect(insertedValues).not.toContain("old-post-1");
  });
});

describe("getActiveSubscribers / getSentSlugs", () => {
  it("returns active subscriber emails", async () => {
    mockSqlReturning([{ email: "a@example.com" }, { email: "b@example.com" }]);
    expect(await getActiveSubscribers()).toEqual(["a@example.com", "b@example.com"]);
  });

  it("returns sent slugs as a Set", async () => {
    mockSqlReturning([{ slug: "post-a" }, { slug: "post-b" }]);
    const slugs = await getSentSlugs();
    expect(slugs).toEqual(new Set(["post-a", "post-b"]));
  });
});

describe("markPostSent", () => {
  it("inserts the slug", async () => {
    const sql = mockSqlReturning([]);
    await markPostSent("post-a");
    expect(sql).toHaveBeenCalled();
  });
});

describe("sendNewPostNotifications", () => {
  it("does nothing when there are no unsent posts", async () => {
    mockGetBlogPosts.mockResolvedValue([post({ slug: "post-a" })]);
    mockSqlReturning([{ slug: "post-a" }]); // getSentSlugs

    const result = await sendNewPostNotifications();

    expect(result).toEqual({ processedSlugs: [], subscriberCount: 0 });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("emails every active subscriber for each newly-published post and marks it sent", async () => {
    mockGetBlogPosts.mockResolvedValue([
      post({ slug: "newer", title: "Newer" }),
      post({ slug: "older", title: "Older" }),
    ]);

    const sql = vi.fn();
    sql
      .mockResolvedValueOnce([]) // getSentSlugs -> nothing sent yet
      .mockResolvedValueOnce([{ email: "a@example.com" }, { email: "b@example.com" }]) // getActiveSubscribers
      .mockResolvedValue([]); // markPostSent calls
    // @ts-expect-error - test double
    mockGetDb.mockReturnValue(sql);

    const result = await sendNewPostNotifications();

    // oldest-unsent-first
    expect(result.processedSlugs).toEqual(["older", "newer"]);
    expect(result.subscriberCount).toBe(2);
    expect(mockSendEmail).toHaveBeenCalledTimes(4);
  });

  it("continues sending to remaining subscribers after one recipient fails", async () => {
    mockGetBlogPosts.mockResolvedValue([post({ slug: "post-a" })]);

    const sql = vi.fn();
    sql
      .mockResolvedValueOnce([]) // getSentSlugs
      .mockResolvedValueOnce([{ email: "bad@example.com" }, { email: "good@example.com" }]) // getActiveSubscribers
      .mockResolvedValue([]); // markPostSent
    // @ts-expect-error - test double
    mockGetDb.mockReturnValue(sql);

    mockSendEmail
      .mockRejectedValueOnce(new Error("bounced"))
      .mockResolvedValueOnce(undefined);

    const result = await sendNewPostNotifications();

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    expect(result.processedSlugs).toEqual(["post-a"]);
  });
});
