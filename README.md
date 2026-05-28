# portfolio

![Test](https://github.com/IAmUser4574/portfolio/actions/workflows/ci-test.yml/badge.svg?branch=main)
![Staging](https://github.com/IAmUser4574/portfolio/actions/workflows/deploy-staging.yml/badge.svg?branch=main)
![Prod](https://github.com/IAmUser4574/portfolio/actions/workflows/deploy-prod.yml/badge.svg?branch=main)

my personal blog and portfolio sitting at [briton.dev](https://briton.dev)

![Alt](https://repobeats.axiom.co/api/embed/ab0a1d8747f846af20c955a04d0c8ce0d19a5993.svg "Repobeats analytics image")

## stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui component conventions
- MDX blog posts via `@next/mdx`
- NeonDB (postgres) — view counts
- Doppler — secrets management
- pnpm for package management

## run the project

Install the [Doppler CLI](https://docs.doppler.com/docs/install-cli), then authenticate and link the project (one-time per machine):

```bash
doppler login
doppler setup   # selects portfolio/dev — reads doppler.yaml
```

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev        # runs `doppler run -- next dev`; secrets are injected automatically
```

Open `http://localhost:3000`.

Useful checks:

```bash
pnpm lint
pnpm build
```

### database

Run the schema once against your Neon database before first use:

```bash
doppler run -- psql "$DATABASE_URL" -f db/schema.sql
```

### doppler commands

```bash
doppler secrets                          # list all secrets for the current config
doppler secrets get DATABASE_URL --plain # print a single secret value
doppler open dashboard                   # open the doppler web UI for this project
doppler run -- <command>                 # run any command with secrets injected
```

## architecture

- `app/` contains App Router routes and global layout/styles.
- `components/` contains reusable UI and site components.
- `components/ui/` contains shadcn/ui-style primitives.
- `content/blog/` contains MDX blog posts.
- `lib/mdx-collection.ts` registers MDX blog posts and projects, then exposes
  helpers for index and detail routes.
- `public/` contains static assets

The main homepage lives in `app/page.tsx`.

## deployment

The site runs on a self-hosted VPS via Docker Compose with two environments:

| Environment | URL | Port | Trigger |
|---|---|---|---|
| Staging | staging.briton.dev | 3001 | any PR push, or push to `main` |
| Production | briton.dev | 3000 | staging workflow succeeds on `main` |

Prod reuses the `latest` image built during the staging step — nothing is rebuilt twice. Piston is reachable at `http://piston_api:2000` over the internal Docker network and is set directly in the Compose service env.

### secrets

All runtime secrets live in Doppler under the `portfolio` project:

| Doppler config | used by |
|---|---|
| `dev` | local development |
| `staging` | staging container |
| `production` | prod container |

Key variables managed in Doppler:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon postgres connection string |
| `PISTON_URL` | Piston code execution API (internal: `http://piston_api:2000`) |

### GitHub Actions secrets

Set in repo Settings → Secrets and variables → Actions → **Secrets**:

| Secret | Value |
|---|---|
| `DOPPLER_TOKEN` | Doppler service token scoped to the `production` config |
| `DOPPLER_TOKEN_STAGING` | Doppler service token scoped to the `staging` config |
| `VPS_HOST` | hostname or IP of the VPS |
| `VPS_USER` | SSH username on the VPS |
| `VPS_SSH_KEY` | private SSH key (corresponding public key must be in `~/.ssh/authorized_keys` on the VPS) |

### GitHub Actions variables

Set in repo Settings → Secrets and variables → Actions → **Variables**:

| Variable | Value |
|---|---|
| `COMPOSE_PROJECT_DIR` | absolute path to the Docker Compose project on the VPS (e.g. `/opt/briton`) |

### VPS setup

Install the Doppler CLI once on the VPS. The deploy scripts pass `DOPPLER_TOKEN` via SSH at runtime so no login is needed on the server itself:

```bash
curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh
```

## adding content

Drop a `.mdx` file with a `metadata` export into `content/blog/` or `content/projects/` — no registration needed. The collection is discovered at runtime via `fs.readdirSync`. Files with an empty `publishedAt` field are excluded.

## features

- Four primary internal destinations: About, Projects, Blog, and CV.
- About scrolls to an in-page section on the homepage.
- Projects and CV are dedicated routes.
- Blog index and blog detail pages are powered by local MDX content.
- Dark mode defaults on and can be toggled from the header.
- Fun easter eggs hidden in the project.

## blog posts

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

## interactive code snippets

Blog posts can embed runnable C++ and Rust snippets via `<SnippetRunner>` (`components/snippet-runner.tsx`). Execution is handled server-side via `app/api/execute/route.ts`, so no CORS configuration is required on the execution backend.

By default, code is executed against the [Wandbox](https://wandbox.org) public API — no auth or setup required.

To route execution through a self-hosted [Piston](https://github.com/engineer-man/piston) instance instead, set the server-side env var `PISTON_URL`. In production this is injected via the Compose environment block (see deployment section). When unset, Wandbox is used as the fallback.

## local mobile testing

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
