# 🏸 Badminton Community MVP — Master Checklist

> Stack:
> - Use docker and docker compose
> - Next.js (App Router) + TypeScript
> - Tailwind CSS
> - Prisma + SQLite (local)
> - Auth.js / NextAuth (Google + LINE)
> - Server Actions
> - Vitest + React Testing Library

> Product Decisions:
> - Events are PUBLIC
> - Join event = instant (no approval)
> - Home feed sorted by upcoming first (startAt asc)

---

## 🔵 Phase 0 — Project Scaffold & Tooling

### 🎯 Goal
Project รันได้จริง + tooling พร้อม

### Checklist
- [x] Create Next.js App Router project (TypeScript)
- [x] Use pnpm
- [x] `pnpm dev` runs successfully

#### Tailwind
- [x] Install Tailwind CSS
- [x] Configure tailwind.config
- [x] Add globals.css
- [x] Tailwind renders correctly

#### Code Quality
- [x] Setup ESLint
- [x] Setup Prettier
- [x] Lint passes

#### Testing
- [x] Install Vitest
- [x] Install React Testing Library
- [x] Configure vitest (jsdom)
- [x] Add test setup file
- [x] `pnpm test` runs successfully

#### Base Structure
- [x] Create folders:
  - src/app
  - src/components/ui
  - src/features
  - src/lib
  - src/styles
- [x] Add `cn()` helper (clsx + tailwind-merge)

#### UI Base
- [x] Button component
- [x] Card component

#### Docs
- [x] Create README.md
- [x] Add local run instructions

---

## 🔵 Phase 1 — Database & Auth Foundation

### 🎯 Goal
Auth + DB ใช้งานได้

### Checklist
#### Prisma
- [x] Install Prisma
- [x] Configure SQLite
- [x] Define models:
  - [x] User
  - [x] Group
  - [x] GroupMember (ADMIN / MEMBER)
  - [x] GroupFollow
  - [x] Event
  - [x] EventParticipant (JOINED / CANCELLED)
- [x] `prisma migrate dev`

#### Seed
- [x] Seed script created
- [x] Seed data:
  - [x] Users
  - [x] Groups
  - [x] Group members
  - [x] Upcoming events

#### Auth
- [x] Setup Auth.js / NextAuth (App Router)
- [x] Google provider (env placeholder)
- [x] LINE provider (env placeholder)
- [x] Session handling
- [x] Helper: getCurrentUser()

#### Docs
- [x] Update README with env + prisma commands

---

## 🔵 Phase 2 — Groups & Public Event Feed

### 🎯 Goal
Public browsing + follow groups

### Checklist
#### Server Actions
- [x] createGroup (auth required)
- [x] followGroup
- [x] unfollowGroup

#### Event Feed
- [x] Home page `/`
- [x] Filter upcoming events (endAt >= now)
- [x] Sort by startAt asc
- [x] Render seeded events

#### Group Page
- [x] Route `/groups/[groupId]`
- [x] Group info display
- [x] Upcoming events list
- [x] Follow / Unfollow button

#### UI
- [x] EventCard
  - title
  - date/time
  - location
  - estimated cost per person
- [x] GroupHeader

#### Architecture
- [x] Server Components default
- [x] Client Components only where needed

---

## 🔵 Phase 3 — Event Creation UX (Admin)

### 🎯 Goal
Admin สร้าง event ได้ด้วย UX คนไทย

### Checklist
#### Server Action
- [x] createEvent
- [x] Admin authorization enforced

#### Event Form — Basic Info
- [x] title
- [x] date
- [x] startTime
- [x] endTime
- [x] locationText
- [x] Google Map URL (optional)

#### Event Form — Costs
- [x] courtCost
- [x] shuttleCost
- [x] otherCost
- [x] Auto-calculated cost per person

#### Event Form — Participants
- [x] maxParticipants
- [x] allowOverbook toggle
- [x] skillLevels multi-select:
  - BEGINNER
  - INTERMEDIATE
  - ADVANCED
  - COMPETITIVE
- [x] notes

#### Event Form — Images
- [x] imageUrls (max 5)

#### Preview
- [x] Live preview card

#### Validation (Zod)
- [x] endTime > startTime
- [x] costs >= 0
- [x] maxParticipants >= 2
- [x] at least 1 skill level
- [x] max 5 images

#### Page
- [x] Route `/groups/[groupId]/events/new`
- [x] Redirect after success

---

## 🔵 Phase 4 — Join Flow, Admin Summary & Tests

### 🎯 Goal
MVP ใช้งานได้ครบ + test ครบ

### Checklist
#### Server Actions
- [ ] joinEvent
- [ ] prevent duplicate join
- [ ] cancelJoin

#### Event Detail
- [ ] Public event detail page
- [ ] Join button
- [ ] Joined state
- [ ] Cancel join option

#### Admin Summary
- [ ] Route `/admin/events/[eventId]`
- [ ] Admin-only access
- [ ] Participant count
- [ ] Participant list

#### Tests — Logic
- [ ] Event schema validation
- [ ] joinEvent success
- [ ] joinEvent duplicate fails
- [ ] cancelJoin behavior
- [ ] Admin authorization

#### Tests — UI
- [ ] Join button state change
- [ ] Cost-per-person display
- [ ] Follow button toggle

---

## 🏁 Final Exit Criteria
- [ ] All phases completed
- [ ] `pnpm dev` works
- [ ] `pnpm test` passes
- [ ] MVP usable end-to-end (create group → create event → join → admin summary)

---

## 💡 Recommended Git Workflow
- 1 phase = 1 commit
- Commit messages:
  - phase0: scaffold
  - phase1: auth + db
  - phase2: public feed
  - phase3: event creation
  - phase4: join & tests
