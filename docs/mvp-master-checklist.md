# 🏸 Badminton Community MVP — Master Checklist

> Stack:
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
- [ ] Create Next.js App Router project (TypeScript)
- [ ] Use pnpm
- [ ] `pnpm dev` runs successfully

#### Tailwind
- [ ] Install Tailwind CSS
- [ ] Configure tailwind.config
- [ ] Add globals.css
- [ ] Tailwind renders correctly

#### Code Quality
- [ ] Setup ESLint
- [ ] Setup Prettier
- [ ] Lint passes

#### Testing
- [ ] Install Vitest
- [ ] Install React Testing Library
- [ ] Configure vitest (jsdom)
- [ ] Add test setup file
- [ ] `pnpm test` runs successfully

#### Base Structure
- [ ] Create folders:
  - src/app
  - src/components/ui
  - src/features
  - src/lib
  - src/styles
- [ ] Add `cn()` helper (clsx + tailwind-merge)

#### UI Base
- [ ] Button component
- [ ] Card component

#### Docs
- [ ] Create README.md
- [ ] Add local run instructions

---

## 🔵 Phase 1 — Database & Auth Foundation

### 🎯 Goal
Auth + DB ใช้งานได้

### Checklist
#### Prisma
- [ ] Install Prisma
- [ ] Configure SQLite
- [ ] Define models:
  - [ ] User
  - [ ] Group
  - [ ] GroupMember (ADMIN / MEMBER)
  - [ ] GroupFollow
  - [ ] Event
  - [ ] EventParticipant (JOINED / CANCELLED)
- [ ] `prisma migrate dev`

#### Seed
- [ ] Seed script created
- [ ] Seed data:
  - [ ] Users
  - [ ] Groups
  - [ ] Group members
  - [ ] Upcoming events

#### Auth
- [ ] Setup Auth.js / NextAuth (App Router)
- [ ] Google provider (env placeholder)
- [ ] LINE provider (env placeholder)
- [ ] Session handling
- [ ] Helper: getCurrentUser()

#### Docs
- [ ] Update README with env + prisma commands

---

## 🔵 Phase 2 — Groups & Public Event Feed

### 🎯 Goal
Public browsing + follow groups

### Checklist
#### Server Actions
- [ ] createGroup (auth required)
- [ ] followGroup
- [ ] unfollowGroup

#### Event Feed
- [ ] Home page `/`
- [ ] Filter upcoming events (endAt >= now)
- [ ] Sort by startAt asc
- [ ] Render seeded events

#### Group Page
- [ ] Route `/groups/[groupId]`
- [ ] Group info display
- [ ] Upcoming events list
- [ ] Follow / Unfollow button

#### UI
- [ ] EventCard
  - title
  - date/time
  - location
  - estimated cost per person
- [ ] GroupHeader

#### Architecture
- [ ] Server Components default
- [ ] Client Components only where needed

---

## 🔵 Phase 3 — Event Creation UX (Admin)

### 🎯 Goal
Admin สร้าง event ได้ด้วย UX คนไทย

### Checklist
#### Server Action
- [ ] createEvent
- [ ] Admin authorization enforced

#### Event Form — Basic Info
- [ ] title
- [ ] date
- [ ] startTime
- [ ] endTime
- [ ] locationText
- [ ] Google Map URL (optional)

#### Event Form — Costs
- [ ] courtCost
- [ ] shuttleCost
- [ ] otherCost
- [ ] Auto-calculated cost per person

#### Event Form — Participants
- [ ] maxParticipants
- [ ] allowOverbook toggle
- [ ] skillLevels multi-select:
  - BEGINNER
  - INTERMEDIATE
  - ADVANCED
  - COMPETITIVE
- [ ] notes

#### Event Form — Images
- [ ] imageUrls (max 5)

#### Preview
- [ ] Live preview card

#### Validation (Zod)
- [ ] endTime > startTime
- [ ] costs >= 0
- [ ] maxParticipants >= 2
- [ ] at least 1 skill level
- [ ] max 5 images

#### Page
- [ ] Route `/groups/[groupId]/events/new`
- [ ] Redirect after success

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
