// base URL for absolute links (emails, redirects). deliberately not derived
// from the incoming request — behind the VPS's reverse proxy, request.url
// can resolve to the container's own bind address (e.g. 0.0.0.0:3000)
// instead of the public hostname
export function siteUrl(): string {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
