// sends transactional email via the Mailgun HTTP API — raw fetch, no SDK,
// matching the style of lib/execute-remote-api.ts

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM;

  if (!apiKey || !domain || !from) {
    throw new Error("Mailgun is not configured (MAILGUN_API_KEY/MAILGUN_DOMAIN/MAILGUN_FROM)");
  }

  const body = new URLSearchParams({ from, to, subject, html });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  let res: Response;
  try {
    res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
      },
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mailgun error ${res.status}: ${text}`);
  }
}
