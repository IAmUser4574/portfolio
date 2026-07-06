// hand-written, inline-styled HTML email templates matching the site's dark
// theme (app/globals.css). email clients ignore CSS variables and Tailwind
// classes, so colors are hardcoded to the same hex values as the dark palette.

type EmailContent = { subject: string; html: string };

const COLORS = {
  background: "#0b0d10",
  card: "#111827",
  border: "#223a58",
  foreground: "#e7eef9",
  mutedForeground: "#99abc1",
  primary: "#d7e8ff",
  primaryForeground: "#07111f",
};

function siteUrl(): string {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function emailLayout(bodyHtml: string, unsubscribeUrl: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:${COLORS.background};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.background};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <span style="font-family:'Courier New',monospace;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${COLORS.mutedForeground};">
                  Briton
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 32px 32px;color:${COLORS.foreground};font-size:16px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${COLORS.border};color:${COLORS.mutedForeground};font-size:12px;line-height:1.6;">
                You're receiving this because you subscribed at briton.dev.
                <a href="${unsubscribeUrl}" style="color:${COLORS.mutedForeground};">Unsubscribe</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:16px;padding:10px 20px;border-radius:6px;background:${COLORS.primary};color:${COLORS.primaryForeground};font-weight:600;text-decoration:none;">${label}</a>`;
}

export function renderWelcomeEmail(unsubscribeUrl: string): EmailContent {
  const body = `
    <h1 style="margin:0 0 12px 0;font-size:22px;">You're subscribed</h1>
    <p style="margin:0 0 8px 0;">Thanks for signing up for my newsletter!</p>
    <p style="margin:0;">You'll get an email whenever a new post goes up on the blog.</p>
  `;
  return {
    subject: "You're subscribed to Briton's newsletter",
    html: emailLayout(body, unsubscribeUrl),
  };
}

export function renderNewPostEmail(
  post: { title: string; excerpt: string; slug: string },
  unsubscribeUrl: string
): EmailContent {
  const postUrl = `${siteUrl()}/blog/${post.slug}`;
  const body = `
    <p style="margin:0 0 8px 0;font-family:'Courier New',monospace;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${COLORS.mutedForeground};">New post</p>
    <h1 style="margin:0 0 12px 0;font-size:22px;">${post.title}</h1>
    <p style="margin:0;color:${COLORS.mutedForeground};">${post.excerpt}</p>
    ${ctaButton(postUrl, "Read the post")}
  `;
  return {
    subject: `New post: ${post.title}`,
    html: emailLayout(body, unsubscribeUrl),
  };
}
