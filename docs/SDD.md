# Lat Tho Lat — Software Design Document

**Status:** M1–M4 implemented in demo-safe mode; production service wiring remains  
**Date:** 2026-10-08  
**Scope:** Public discovery, donation workflow, organizer dashboard, and admin review foundation

## 1. Product intent

Lat Tho Lat ("hands to hands") is a community crowdfunding platform for meaningful causes in Myanmar. The first product slice should make a visitor feel three things quickly:

1. There are real, understandable causes to support.
2. A small contribution is easy to make in Myanmar Kyat.
3. The platform shows how shared giving is moving a campaign forward.

The implementation follows the product and domain contract in `README.md`. The repository now contains the UI foundation plus server-side boundaries for Clerk, Prisma/Neon, validated donations, campaign updates, donor history, and admin review. When external credentials are absent, the app intentionally falls back to demo data so the interface remains previewable.

## 2. Research synthesis

Mobbin references were reviewed for the three requested patterns. The goal was to borrow interaction structure and information hierarchy, not to copy branding or assets.

| Pattern | Mobbin reference | Useful pattern applied |
| --- | --- | --- |
| Campaign card and progress | [GoFundMe campaign detail](https://mobbin.com/screens/86fd21f9-47f8-4d78-a2ff-5c958becf118) and [PayPal fundraiser dashboard](https://mobbin.com/screens/65d94ee8-bc88-4820-a62c-414940ba1bd4) | Show raised amount, goal, percentage, a visible progress track, supporter count, deadline, organizer, and one clear support action in one scan-friendly card. |
| Donation form | [GoFundMe donation checkout](https://mobbin.com/screens/cfd144c0-b262-49f5-82f9-b9ddf2ea5346) and [PayPal donation amount step](https://mobbin.com/screens/2a17ba24-56eb-4317-8e88-5caae21e5d93) | Use preset amounts plus a custom amount, keep the contribution summary visible, make anonymity explicit, and separate payment-channel selection from the campaign story. |
| Funding progress | [GoFundMe fundraiser progress view](https://mobbin.com/screens/5b74a28a-82c6-4480-bed3-f3a88373ec5d) | Pair a percentage/ring or bar with a human-readable goal, then reinforce trust with update/verification language and supporter context. |

### Design decisions

- Use a warm off-white canvas, ink navy, periwinkle progress, and coral action color to feel human without losing legibility.
- Keep campaign content in white cards with generous radius and low-elevation shadows; the progress bar is a primary information element, not a decorative accent.
- Use compact badges for category and verification so status is visible without relying on color alone.
- Keep the donation form in a focused modal/drawer so the selected campaign context remains visible while the visitor chooses an amount.
- Treat the donation flow as a demo intent until manual payment verification and server actions are implemented; the UI says this explicitly.

## 3. MVP scope

### Implemented in this milestone

- Responsive homepage shell with navigation and footer.
- Hero section with a featured campaign, progress ring, and primary discovery/support actions.
- Campaign grid with category tabs and text search.
- Reusable campaign cards with image, category, location, organizer, progress, goal, donors, deadline, and support action.
- Donation dialog with preset/custom MMK amounts, payment method selection, anonymous giving, validation guard, and success state.
- Trust and impact sections that communicate verification and progress updates.
- Component and styling foundation for future App Router pages.
- Public campaign list and detail routes backed by a service boundary.
- Optional Clerk provider, protected `/dashboard` and `/admin` routes, and demo-mode auth fallback.
- Prisma 7 schema/configuration, generated client, `.env.example`, and a seed script.
- Zod schemas and Server Actions for campaign drafts, contribution submission, organizer updates, campaign review, and donation review.
- Idempotent pending-donation creation with server-side campaign eligibility checks.
- Organizer/donor dashboard, admin review queue, loading/error/empty states, and a small English/Burmese copy map.

### Deliberately deferred

- Clerk account configuration and real session testing (the provider and route boundary are implemented, but keys are not present in this workspace).
- Neon connection, migrations, and real seed execution (schema, generated client, and seed script are implemented).
- Payment-evidence file uploads and gateway callbacks.
- Burmese localization, notifications, and payment gateway callbacks.

## 4. Technical architecture

### Stack

- Next.js App Router + React + TypeScript.
- Tailwind CSS v4 through PostCSS.
- Lucide React for all interface icons.
- Plain typed React props and a small `cn` helper for reusable components.

### Route and component map

```text
src/app/layout.tsx                  global metadata, navbar, footer
src/app/page.tsx                    homepage entrypoint
src/app/campaigns/                  public list, detail, loading, and error states
src/app/dashboard/                  donor/organizer workspace
src/app/admin/                      protected campaign/donation review queue
src/app/sign-in/ and sign-up/       Clerk routes with demo fallback
src/app/globals.css                 design tokens and global styles
src/components/layout/              navbar and footer
src/components/ui/                  Button, Badge, ProgressBar, ProgressRing
src/components/campaigns/           CampaignCard, CampaignGrid
src/components/donations/           DonationDialog
src/components/dashboard/           CampaignForm, UpdateForm
src/components/home/                HomeExperience composition and local state
src/lib/data.ts                     typed demo campaigns and categories
src/lib/utils.ts                    formatting and progress helpers
src/lib/auth.ts                     Clerk-to-local-user resolution with demo fallback
src/lib/db.ts                       PrismaPg singleton and database availability boundary
src/lib/validations/                Zod schemas for writes
src/server/actions/                 Server Actions for member and admin writes
src/server/services/                Campaign and donation domain services
prisma/schema.prisma                PostgreSQL data model
prisma/seed.ts                      Development seed data
```

`HomeExperience` owns the selected campaign and opens `DonationDialog`. Campaign filtering is local UI state in `CampaignGrid`; campaign display and money calculations remain pure functions. Server pages call domain services, and those services choose Prisma when `DATABASE_URL` exists or typed demo data when it does not.

### Domain alignment

The UI names and states intentionally map to the README data model:

- `Campaign.raised` represents verified contributions only.
- `goal`, `deadline`, and `donors` are displayed as read-only campaign facts.
- A future `Donation` server action must validate a whole-MMK amount, eligible campaign status, payment method, and idempotency key on the server.
- The submit action creates a `PENDING` donation through a validated Server Action when the database is configured, and uses an idempotent in-memory demo store otherwise.

## 5. Interaction flows

### Visitor discovery

1. Visitor lands on the featured campaign and sees the goal, percentage, raised amount, days left, and supporter count.
2. Visitor jumps to “Explore causes”.
3. Visitor filters by category or searches by title/category/location.
4. Visitor opens a campaign’s support dialog.

### Donation intent

1. Visitor selects one of four suggested amounts or enters a custom amount.
2. Amounts under 1,000 MMK keep the continue action disabled.
3. Visitor selects KBZPay, Wave Money, or bank transfer.
4. Visitor may enable anonymous giving.
5. Visitor sees the campaign thumbnail and contribution summary throughout the form.
6. Continue displays a confirmation state explaining that the current release records intent only and that verification will be added with the backend workflow.

## 6. Reusable component contracts

| Component | Contract | Accessibility requirement |
| --- | --- | --- |
| `Button` | `variant`, `size`, native button props | Visible focus ring, disabled state, text plus icon for actions |
| `ProgressBar` | `value`, optional classes, label | `progressbar` role and `aria-valuenow` |
| `ProgressRing` | `value`, optional size | `img` role with percentage label |
| `CampaignCard` | typed `Campaign`, `onDonate` callback | Image alt text, visible status text, support button |
| `CampaignGrid` | campaigns and callback | Tab semantics for category controls and labelled search |
| `DonationDialog` | selected campaign and close callback | Modal semantics, Escape/backdrop close, keyboard-friendly controls |

## 7. Delivery plan (SDD milestones)

### M1 — Foundation and visual language (complete)

- [x] Create Next.js App Router TypeScript scaffold.
- [x] Add Tailwind and Lucide configuration.
- [x] Establish color, radius, spacing, and type conventions in shared components.
- [x] Create responsive navigation, footer, and page shell.

### M2 — Discovery and trust (complete)

- [x] Add featured campaign card and progress ring.
- [x] Add campaign grid, categories, search, organizer context, deadlines, and supporter counts.
- [x] Add trust/verification and platform impact sections.

### M3 — Donation intent (complete)

- [x] Add reusable donation dialog.
- [x] Add preset/custom MMK amounts and minimum amount guard.
- [x] Add payment-method choice and anonymous option.
- [x] Add explicit demo confirmation state.

### M4 — Backend workflow (implemented)

- [x] Add Clerk provider, sign-in/sign-up routes, and local user resolution.
- [x] Add Prisma/Neon schema, generated client, and seeded development campaigns.
- [x] Replace demo data with server-query service boundaries and format Decimal values at UI boundaries.
- [x] Implement validated donation Server Action with idempotency and `PENDING` status.
- [x] Add organizer updates, donor history, campaign review, and donation verification actions.

### M5 — Hardening and release (in progress)

- [x] Add a runnable domain-check script for progress, validation, and demo idempotency.
- [ ] Add UI tests for discovery, filtering, donation intent, and mobile keyboard flow.
- [x] Add error/loading/empty states and an English/Burmese copy map.
- [ ] Run production build, migration deploy, and accessibility review.

## 8. Acceptance criteria for the current slice

- A visitor can reach active campaigns from the hero and navbar.
- Every campaign card exposes title, category, location, organizer, raised amount, goal, progress, supporters, deadline, and support action.
- Search and category controls update the visible campaign set without a page reload.
- The donation dialog preserves selected campaign context and supports preset and custom amounts.
- The dialog makes anonymous giving and payment channel selection explicit.
- The UI remains usable at mobile widths and uses labelled icon-only controls.
- The codebase passes TypeScript and lint checks; production worker execution is environment-blocked in this workspace.
- `/dashboard` exposes contribution history, campaign drafting, and update publishing boundaries.
- `/admin` enforces a server-side ADMIN role before exposing review actions.
- Donation writes validate amount, payment method, campaign eligibility, and idempotency on the server.

## 9. Verification commands

```bash
npm install
npm run lint
npx tsc --noEmit
npm run test:domain
npm run db:validate
npm run db:generate
npm run build
```

`npm run lint`, `npx tsc --noEmit`, and `npm run db:validate` pass in this workspace. The domain-check and production build commands are implemented but this managed environment blocks their child-process workers with `spawn EPERM`. A real Neon connection, `DIRECT_URL`, Clerk keys, and migration deployment are still required before production acceptance.
