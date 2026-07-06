const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

function hexEncode(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexDecode(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function getHmacKey(usage: "sign" | "verify"): Promise<CryptoKey> {
  const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET!;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

// keyed HMAC (not the plain hashVisitor-style SHA-256 used for view counts) —
// unsubscribe links must prove ownership of the email, not just anonymize it
export async function signUnsubscribeToken(email: string): Promise<string> {
  const key = await getHmacKey("sign");
  const data = new TextEncoder().encode(normalizeEmail(email));
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return hexEncode(signature);
}

export async function verifyUnsubscribeToken(
  email: string,
  token: string
): Promise<boolean> {
  if (!token || token.length % 2 !== 0) return false;

  const key = await getHmacKey("verify");
  const data = new TextEncoder().encode(normalizeEmail(email));

  try {
    return await crypto.subtle.verify("HMAC", key, hexDecode(token).buffer as ArrayBuffer, data);
  } catch {
    return false;
  }
}
