## Badminton Community MVP

Next.js (App Router) app for Thai badminton groups with instant joins, follows, and admin event management.

### Stack
- Next.js 16 + TypeScript + Tailwind CSS
- NextAuth (Google, LINE) with Prisma adapter
- Prisma ORM (SQLite dev, easy Postgres switch)
- Server Actions for business ops (no REST for core flows)
- Vitest + React Testing Library
- Zod validation

### Setup
1) **Install deps**
```
pnpm install
```
> If your default Node is <20.19, run commands with a newer Node (22.12 works) e.g. `set PATH=%cd%\.node22\node-v22.12.0-win-x64;%PATH% && pnpm install`

2) **Env**
```
cp .env.example .env
```
Fill `DATABASE_URL`, `AUTH_SECRET`, `GOOGLE_*`, `LINE_*`, `NEXTAUTH_URL`.

3) **Database**
```
pnpm db:migrate -- --name init
pnpm db:seed
```

4) **Dev server**
```
pnpm dev
```

5) **Tests**
```
pnpm test
```

### Docker (dev)
```
cp .env.example .env
docker compose build app
docker compose run --rm app pnpm db:migrate -- --name init
docker compose run --rm app pnpm db:seed
docker compose up
```
- Uses Node 22 base image, mounts the repo for hot reload, and exposes `localhost:3000`.
- SQLite file lives on the bind mount (`file:./dev.db`) so data persists while containers restart.

### Features
- Public event feed (upcoming sorted by start), past events section
- Google/LINE sign-in
- Groups: create, follow/unfollow, view upcoming events
- Admin-only: create events (rich form), view participant summary
- Events: public detail, instant join/cancel, capacity guard, optional overbook
- Live cost-per-person preview, skill-level targeting, image gallery (max 5)

### Project structure
- `src/app` – routes (feed, auth, groups, events, admin)
- `src/features/*` – actions, services, UI per domain
- `src/components/ui` – shared primitives (button, input, card, etc.)
- `src/lib` – auth, prisma client, utilities
- `prisma/schema.prisma` – models; `prisma/seed.ts` for starter Thai data
- `src/__tests__` – validation, action, and UI tests (14 total)
