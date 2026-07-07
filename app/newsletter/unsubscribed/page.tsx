import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";

type UnsubscribedPageProps = {
  searchParams: Promise<{ ok?: string }>;
};

export default async function UnsubscribedPage({ searchParams }: UnsubscribedPageProps) {
  const { ok } = await searchParams;
  const succeeded = ok !== "0";

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Newsletter"
          title={succeeded ? "You're unsubscribed." : "That link isn't valid."}
        >
          {succeeded
            ? "You won't get any more emails about new posts. You can resubscribe any time from the blog."
            : "This unsubscribe link is invalid or expired. If you're still getting emails you don't want, reply to one and let me know."}
        </SectionHeading>
      </section>
    </PageShell>
  );
}
