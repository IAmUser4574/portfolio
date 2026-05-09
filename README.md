# Portfolio

A modern personal portfolio and project homebase built with Next.js, React,
Tailwind CSS, shadcn/ui-style components, and MDX.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui component conventions
- MDX blog posts via `@next/mdx`
- pnpm for package management

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
pnpm lint
pnpm build
```

## Architecture

- `app/` contains App Router routes and global layout/styles.
- `components/` contains reusable UI and site components.
- `components/ui/` contains shadcn/ui-style primitives.
- `content/blog/` contains MDX blog posts.
- `lib/mdx-collection.ts` registers MDX blog posts and projects, then exposes
  helpers for index and detail routes.
- `public/` contains static assets

The main homepage lives in `app/page.tsx`.

## Cloudflare Pages Note

The MDX collection registry is explicit instead of discovered with runtime
filesystem reads. Cloudflare Pages deploys this Next.js app through OpenNext on
Workers, where request-time `node:fs` access is not available. Keeping the MDX
modules statically imported ensures `/blog` and `/projects` are bundled into the
Worker and do not 500 in production.

When the site is hosted as a full application runtime with normal filesystem
access, this workaround can be removed by switching `lib/mdx-collection.ts` back
to directory discovery under `content/`.

## Features

- Four primary internal destinations: About, Projects, Blog, and CV.
- About scrolls to an in-page section on the homepage.
- Projects and CV are dedicated routes.
- Blog index and blog detail pages are powered by local MDX content.
- Dark mode defaults on and can be toggled from the header.
- Fun easter eggs hidden in the project.

## Writing Blog Posts

Add a new `.mdx` file under `content/blog/` with a metadata export:

```mdx
export const metadata = {
  title: "Post Title",
  excerpt: "Short summary for the blog index.",
  publishedAt: "2026-05-05",
  readingTime: "3 min read",
  tags: ["nextjs", "portfolio"],
};

Your post content goes here.
```

Register new MDX files in `lib/mdx-collection.ts` so they appear in `/blog` and
get a static `/blog/[slug]` page.

Note - MDX files with an empty `publishedAt` field will not be included.

## Local Mobile Testing

When testing `pnpm dev` from a phone on the LAN, Next.js may block dev resources
unless the phone uses an allowed origin. Add the dev host/IP to
`allowedDevOrigins` in `next.config.ts`, then restart the dev server.

Example:

```ts
const nextConfig = {
  allowedDevOrigins: ["192.168.1.45"],
};
```

This setting is for development only. Staging and production deployments usually
do not need it.
