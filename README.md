# Briton Portfolio Homebase

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
- `lib/blog.ts` registers blog posts and exposes helpers for the blog index and
  static post routes.
- `public/` contains static assets, including the sketch reference image and
  Minecraft-style logo asset.

The main homepage lives in `app/page.tsx`. It renders a centered hero, primary
navigation buttons, the Minecraft/Fun Zone name component, and the scrollable
About section.

## Features

- Four primary internal destinations: About, Projects, Blog, and CV.
- About scrolls to an in-page section on the homepage.
- Projects and CV are dedicated routes.
- Blog index and blog detail pages are powered by local MDX content.
- Dark mode defaults on and can be toggled from the header.
- Fun Zone hides a Minecraft Mode toggle that swaps the name into a generated
  Minecraft-inspired transparent PNG wordmark.
- Weighted splash phrases power the Minecraft-style yellow overlay text.

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

Then import and register the post in `lib/blog.ts` so it appears in `/blog` and
gets a static `/blog/[slug]` page.

## Local Mobile Testing

When testing `next dev` from a phone on the LAN, Next.js may block dev resources
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
