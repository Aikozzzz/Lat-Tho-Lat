# Lat Tho Lat

**A community crowdfunding platform that brings people together to support meaningful causes in Myanmar.**

Lat Tho Lat connects campaign organizers with donors. Organizers can explain their goals, collect contributions in Myanmar Kyat (MMK), and publish updates showing how funds are used. Donors can discover campaigns, follow funding progress, and review their contribution history.

The application uses **Next.js as the full-stack framework**, with React, TypeScript, Tailwind CSS, Lucide React, reusable components, Zod, Neon PostgreSQL, Prisma, and Clerk authentication.

> **Project status:** The public UI and M4 server-side workflow boundaries are implemented in `src/`: responsive campaign discovery, funding progress patterns, validated pending donations, organizer updates, donor history, and admin review actions. Production Clerk/Neon credentials, migrations, payment evidence, and deployment hardening remain. See the implementation plan and research notes in [`docs/SDD.md`](docs/SDD.md).

## Contents

- [Project goals](#project-goals)
- [Technology stack](#technology-stack)
- [Roles and planned features](#roles-and-planned-features)
- [Application architecture](#application-architecture)
- [Reusable component design](#reusable-component-design)
- [Suggested project structure](#suggested-project-structure)
- [Development setup](#development-setup)
- [Data model](#data-model)
- [Validation and authorization](#validation-and-authorization)
- [Campaign and donation workflows](#campaign-and-donation-workflows)
- [Development commands](#development-commands)
- [Implementation roadmap](#implementation-roadmap)
- [Verification checklist](#verification-checklist)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

## Project goals

- Make community fundraising easy to discover and support.
- Show clear campaign goals, deadlines, and verified funding progress.
- Give organizers a place to publish progress and spending updates.
- Provide donors with a reliable record of their contributions.
- Give administrators tools to review campaigns and donation evidence.
- Deliver a responsive interface for mobile phones and desktop browsers.

## Technology stack

| Technology | Responsibility |
| --- | --- |
| Next.js App Router | Pages, layouts, server rendering, Server Actions, and Route Handlers |
| React | Component-based interfaces and interactive forms |
| TypeScript | Shared types and compile-time checks |
| Tailwind CSS | Responsive styling and consistent visual design |
| Lucide React | Icons for navigation, actions, and status indicators |
| Reusable components | Shared buttons, inputs, cards, dialogs, and page layouts |
| Zod | Runtime validation of form inputs and server request payloads |
| Neon PostgreSQL | Hosted relational database for application data |
| Prisma ORM | Data models, migrations, and typed database queries |
| Clerk | Sign-up, sign-in, account management, and authenticated sessions |

Next.js handles the frontend and backend in one project. Server Components load data; Client Components provide interactions; Server Actions handle application mutations; Route Handlers handle HTTP integrations when needed.

The examples below target **Next.js 16 and Prisma ORM 7**. Keep the installed Prisma packages on the same major version and commit the generated lockfile. These explicit versions keep the configuration examples consistent.

## Roles and planned features

Use a default `MEMBER` role for normal accounts. A member can both donate and organize campaigns. `ADMIN` is a separately assigned role.

| User | Planned capabilities |
| --- | --- |
| Visitor | Browse published campaigns, search, filter, and read public updates |
| Member as donor | Submit a donation, view its verification status, and review personal donation history |
| Member as organizer | Create drafts, submit campaigns for review, manage owned campaigns, and publish updates |
| Admin | Review campaigns, approve or reject donation evidence, moderate content, and inspect platform activity |

### Campaign discovery

- Campaign cards with title, category, goal, verified amount raised, deadline, and organizer.
- Campaign details with a full description and progress updates.
- Search, category filters, pagination, and useful empty states.

### Organizer dashboard

- Draft creation and editing.
- Submission for admin review before publication.
- Donation summaries for owned campaigns.
- Progress updates and explanations of fund usage.

### Donor dashboard

- Contribution history with campaign, amount, date, and status.
- Donation confirmation after verification.
- An optional public anonymity setting; the underlying donation remains associated with its member for account history and review.

### Admin dashboard

- Pending campaign and donation review queues.
- Reasons for rejection and records of moderation decisions.
- Summary counts and verified contribution totals.

## Application architecture

| Layer | Design |
| --- | --- |
| Public interface | Next.js pages and reusable React components styled with Tailwind CSS |
| Interactive interface | Client Components for forms, dialogs, filters, and local UI state |
| Server logic | Server Actions and Route Handlers validate requests, authenticate users, and check permissions |
| Authentication | Clerk supplies the authenticated user ID |
| Application identity | A Prisma `User` record links its `clerkId` to campaigns and donations |
| Persistence | Server-only Prisma Client accesses Neon PostgreSQL |

For each write request: obtain the Clerk identity, resolve the local user, validate input with Zod, check role or ownership, and perform the database operation. Return only the data needed by the interface.

Database queries and secret keys stay in server code. Use the Node.js runtime for the PostgreSQL adapter shown below.

## Reusable component design

| Component | Intended reuse |
| --- | --- |
| `Button`, `Input`, `Textarea`, `Select` | Consistent controls across forms |
| `FormField`, `FieldError` | Labels, validation messages, and accessible descriptions |
| `Card`, `Badge`, `ProgressBar` | Shared visual patterns |
| `Modal`, `ConfirmDialog` | Donation and moderation interactions |
| `Navbar`, `Footer`, `DashboardSidebar` | Shared navigation and page layout |
| `CampaignCard`, `CampaignGrid` | Homepage, discovery, and organizer views |
| `CampaignForm`, `DonationForm` | Domain-specific forms |
| `DonationHistory`, `UpdateTimeline` | Contribution and transparency records |
| `LoadingState`, `EmptyState`, `ErrorState` | Consistent feedback |

Components receive typed props. Keep campaign rules in server services rather than duplicating them across cards or pages. Use `"use client"` for components that require hooks, browser APIs, or event handlers. Give icon-only buttons accessible labels, and pair status colors with text.

## Suggested project structure

These paths are a proposed layout. Create feature files as their functionality is implemented.

| Path | Purpose |
| --- | --- |
| `src/app/page.tsx` | Public homepage |
| `src/app/campaigns/page.tsx` | Campaign discovery |
| `src/app/campaigns/[id]/page.tsx` | Campaign details |
| `src/app/dashboard/` | Member dashboard, campaigns, and donation history |
| `src/app/admin/` | Campaign review and donation verification |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Clerk sign-in page |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Clerk sign-up page |
| `src/app/api/` | Route Handlers for integrations, if required |
| `src/components/ui/` | Shared interface primitives |
| `src/components/layout/` | Navbar, footer, and dashboard layout |
| `src/components/campaigns/` | Campaign cards, forms, and progress displays |
| `src/components/donations/` | Donation forms and history |
| `src/lib/db.ts` | Server-only Prisma Client |
| `src/lib/auth.ts` | Clerk-to-local-user resolution |
| `src/lib/permissions.ts` | Role and resource-ownership checks |
| `src/lib/validations/` | Shared Zod schemas |
| `src/lib/money.ts` | MMK formatting and amount conversion |
| `src/server/actions/` | Server Actions for user operations |
| `src/server/services/` | Campaign and donation business rules |
| `src/generated/prisma/` | Generated Prisma Client |
| `src/proxy.ts` | Clerk middleware for Next.js 16 |
| `prisma/schema.prisma` | Database schema |
| `prisma/migrations/` | Versioned database migrations |
| `prisma.config.ts` | Prisma CLI configuration |

## Development setup

Run terminal commands from the project root unless a different location is stated. This section creates a new project; for an existing repository, install its locked dependencies and adapt its configuration instead of scaffolding over it.

### 1. Prerequisites

- Node.js **22.12 or newer within the 22.x release line**, or Node.js 24.x.
- npm and Git.
- A Neon account and a development PostgreSQL database.
- A Clerk account and a development application.

### 2. Create the Next.js project

Run from the parent directory where you want the project folder:

```bash
npx create-next-app@16 Lat Tho Lat --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd Lat Tho Lat
```

This scaffolds Next.js, React, TypeScript, Tailwind CSS, and ESLint. Keep the generated global stylesheet, PostCSS configuration, and TypeScript configuration.

### 3. Install project dependencies

```bash
npm install @clerk/nextjs lucide-react zod server-only
npm install @prisma/client@7 @prisma/adapter-pg@7 pg dotenv
npm install --save-dev prisma@7 @types/pg
npx prisma init --datasource-provider postgresql
```

`@prisma/adapter-pg` and `pg` connect Prisma to PostgreSQL. `dotenv` loads database variables for Prisma CLI commands. `server-only` helps prevent server utilities from entering client bundles.

### 4. Configure Neon and Clerk

In Neon, create a development database and copy both its **pooled** and **direct** PostgreSQL connection strings. Preserve the TLS parameters provided by Neon.

In Clerk, create a development application, choose the desired sign-in methods, and obtain its publishable key and secret key.

Create `.env` in the project root, replacing every placeholder:

```dotenv
# Pooled connection for the running application
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler/DB?sslmode=require"

# Direct connection for Prisma CLI and migrations
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_REPLACE_ME"
CLERK_SECRET_KEY="sk_test_REPLACE_ME"

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

Copy the placeholder template to `.env.example` for teammates. Keep actual `.env` files out of Git, while allowing `.env.example`. Restart the development server after environment changes.

### 5. Configure Prisma ORM 7

Replace the generated root `prisma.config.ts` with:

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DIRECT_URL") },
});
```

Use this header in `prisma/schema.prisma`, followed by the starter models in [Data model](#data-model):

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

The CLI connection URL belongs in `prisma.config.ts`. The runtime connection is supplied through the adapter below.

Create `src/lib/db.ts`:

```ts
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const globalForDb = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForDb.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

if (process.env.NODE_ENV !== "production") globalForDb.prisma = db;
```

The development singleton reuses the client during hot reloads.

After adding the starter models, run against the development database:

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name init
npx prisma generate
```

If the database role cannot create the temporary shadow database needed by `migrate dev`, configure a separate development shadow database using `datasource.shadowDatabaseUrl`. Use a dedicated database for this purpose.

### 6. Add Clerk authentication

In `src/app/layout.tsx`, preserve the scaffold's styles and fonts, and wrap page content inside `<ClerkProvider>` within `<body>`:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
```

Create `src/proxy.ts`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtected(request)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/(.*)"],
};
```

For Next.js 15 and earlier, use `src/middleware.ts` instead. Route protection checks sign-in; admin permissions still need server-side role checks.

Create `src/app/sign-in/[[...sign-in]]/page.tsx`:

```tsx
import { SignIn } from "@clerk/nextjs";
export default function Page() { return <SignIn />; }
```

Create `src/app/sign-up/[[...sign-up]]/page.tsx`:

```tsx
import { SignUp } from "@clerk/nextjs";
export default function Page() { return <SignUp />; }
```

Add visible sign-in/sign-up links and Clerk's `UserButton` to the navigation as the interface is built.

### 7. Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The scaffold and authentication foundation can now be developed into the campaign and donation flows described below.

## Data model

This starter schema supports members, campaigns, contributions, and public updates. Add these definitions below the Prisma header in `prisma/schema.prisma`.

```prisma
enum Role {
  MEMBER
  ADMIN
}

enum CampaignStatus {
  DRAFT
  PENDING_REVIEW
  ACTIVE
  REJECTED
  COMPLETED
  CANCELLED
}

enum DonationStatus {
  PENDING
  VERIFIED
  REJECTED
  REFUNDED
}

model User {
  id        String     @id @default(cuid())
  clerkId   String     @unique
  role      Role       @default(MEMBER)
  campaigns Campaign[]
  donations Donation[]
  createdAt DateTime   @default(now())
}

model Campaign {
  id          String         @id @default(cuid())
  title       String
  description String
  category    String
  goalAmount  Decimal        @db.Decimal(18, 0)
  deadline    DateTime
  status      CampaignStatus @default(DRAFT)
  organizerId String
  organizer   User           @relation(fields: [organizerId], references: [id])
  donations   Donation[]
  updates     CampaignUpdate[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([status, createdAt])
  @@index([organizerId])
}

model Donation {
  id               String         @id @default(cuid())
  campaignId       String
  campaign         Campaign       @relation(fields: [campaignId], references: [id])
  donorId          String
  donor            User           @relation(fields: [donorId], references: [id])
  amount           Decimal        @db.Decimal(18, 0)
  currency         String         @default("MMK")
  status           DonationStatus @default(PENDING)
  isAnonymous      Boolean        @default(false)
  paymentMethod    String
  paymentReference String?
  idempotencyKey   String         @unique
  createdAt        DateTime       @default(now())
  verifiedAt       DateTime?

  @@index([campaignId, status])
  @@index([donorId, createdAt])
}

model CampaignUpdate {
  id         String   @id @default(cuid())
  campaignId String
  campaign   Campaign @relation(fields: [campaignId], references: [id])
  title      String
  content    String
  createdAt  DateTime @default(now())

  @@index([campaignId, createdAt])
}
```

This MVP accepts whole-kyat amounts and stores them as fixed-precision decimals. Serialize Prisma Decimal values as strings at JSON and client boundaries. Compute `amountRaised` from donations currently marked `VERIFIED`; pending, rejected, and refunded records do not count.

Create or resolve the local user after checking `await auth()` on the server. Upsert by the unique `clerkId`, and let new users receive the database's `MEMBER` default. Clerk manages credentials; the application stores relationships and roles. Admin promotion must be performed through a trusted administrative process.

Before expanding the app, add review reasons, reviewer IDs, audit records, and payment-evidence metadata as needed. Uploaded images or receipts require a separately selected file-storage service; Neon stores their metadata rather than providing that upload service.

## Validation and authorization

Create shared schemas under `src/lib/validations/`. For example, `src/lib/validations/donation.ts`:

```ts
import { z } from "zod";

const wholeKyat = z.string().trim()
  .regex(/^[1-9]\d{0,17}$/, "Enter a positive whole-kyat amount");

export const donationSchema = z.object({
  campaignId: z.string().min(1),
  amount: wholeKyat,
  paymentMethod: z.enum(["KBZPAY", "WAVEPAY", "BANK_TRANSFER"]),
  paymentReference: z.string().trim().min(3).max(100),
  isAnonymous: z.boolean().default(false),
  idempotencyKey: z.string().uuid(),
});
```

The payment methods above are proposed manual-verification options, not completed gateway integrations. Adjust them to the project's actual collection channels. The form should send the amount as a decimal string and anonymity as a boolean; normalize raw `FormData` values before validation.

Validate on the client for feedback and again on the server before writing. The server must also confirm that the campaign is active and its deadline has not passed.

| Operation | Required server check |
| --- | --- |
| Create a campaign | Signed-in member; organizer ID comes from the session |
| Edit a campaign | Current user owns the campaign and its status allows editing |
| Submit a donation | Signed-in member; valid amount; eligible campaign |
| Read donation history | Query is scoped to the current member |
| Publish an update | Current user owns the campaign |
| Approve a campaign or donation | Current local user has `ADMIN` role |

Never accept role, donor ID, organizer ID, or a verified payment status from the browser as authoritative. Use a stable idempotency key for retries of the same submission; duplicate requests must not create duplicate donations. Check that a reused key belongs to the same user and request.

## Campaign and donation workflows

### Campaign lifecycle

1. A member creates a `DRAFT` campaign.
2. Submission changes it to `PENDING_REVIEW`.
3. An admin approves it as `ACTIVE` or rejects it with a reason.
4. Donors can support an active campaign before its deadline.
5. The organizer publishes updates and fund-usage information.
6. Campaign closure follows an explicit completion or cancellation decision. Goal achievement and deadline expiry should be displayed separately from final completion.

### Donation lifecycle

1. A member chooses an eligible campaign and enters an amount.
2. The member transfers money through the configured collection channel and submits a reference; the app creates a `PENDING` record.
3. An admin checks actual payment evidence and approves or rejects the record.
4. Verification changes the status to `VERIFIED`, records the verification time, and makes the amount count toward campaign progress.
5. The donor sees the updated status and confirmation in their dashboard.

Submitting a reference does not prove that payment succeeded. For the initial MVP, use manual verification. A future gateway integration must verify signed callbacks and handle duplicate delivery before changing payment status.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npx eslint .` | Run the scaffold's ESLint configuration |
| `npx tsc --noEmit` | Check TypeScript types |
| `npx prisma format` | Format the database schema |
| `npx prisma validate` | Validate the schema and configuration |
| `npx prisma migrate dev --name change_name` | Create and apply a development migration |
| `npx prisma generate` | Regenerate the Prisma Client |
| `npx prisma studio` | Inspect development data |
| `npm run build` | Create a production build |
| `npm run start` | Run a built production application locally |
| `npx prisma migrate deploy` | Apply committed migrations during deployment |

Run `prisma generate` before type checking or building a fresh checkout that imports the generated client. Additional test or seed commands require their corresponding scripts to be implemented first.

## Implementation roadmap

- [x] Initialize the project and add Clerk sign-in/sign-up boundaries.
- [ ] Configure Neon credentials, deploy the schema, and resolve production local users.
- [x] Build reusable controls, navigation, and responsive layouts.
- [x] Implement organizer campaign drafts and submission boundaries.
- [x] Implement admin campaign review and public discovery.
- [x] Implement pending donations, verification actions, and donor history.
- [x] Calculate verified funding progress and publish campaign updates.
- [x] Add audit records, rejection reasons, and duplicate-payment review boundaries.
- [x] Add focused domain checks; UI tests and deployment configuration remain.

Possible later extensions include campaign images, payment-receipt uploads, notifications, Burmese/English localization, bookmarks, and verified payment gateway integration. These require implementation and, where applicable, an additional service choice.

## Verification checklist

Before marking the MVP complete, verify the following with realistic development accounts:

- A new account receives member permissions; signing in resolves the same local user.
- Anonymous visitors cannot mutate campaigns, donations, or admin resources.
- One organizer cannot edit another organizer's campaign.
- A member cannot gain admin privileges through form inputs or direct requests.
- Draft, rejected, and expired campaigns cannot accept new donations.
- Invalid or missing amounts produce useful errors without creating records.
- Retrying one donation submission creates only one record.
- Two concurrent verification requests cannot verify a donation twice.
- Pending contributions do not increase the public raised total.
- Rejected and refunded contributions are excluded from the total.
- Donor history and private payment references are scoped correctly.
- Forms work with keyboard navigation and narrow mobile screens.
- Schema validation, linting, type checking, and production build pass.

Prioritize automated tests for ownership, status transitions, idempotency, and contribution totals. Add UI tests for the main campaign and donation journeys after implementing them.

## Deployment

Deploy to a platform that supports the Next.js Node.js server runtime, and connect it to a production Neon database and Clerk production application.

1. Configure production database URLs and Clerk keys through the host's environment settings.
2. Generate Prisma Client before the build: `npx prisma generate`.
3. Apply committed production migrations through a controlled release step: `npx prisma migrate deploy`.
4. Build with `npm run build` and start with the host's supported Next.js configuration.
5. Configure Clerk's production domain and authentication redirects.
6. Verify sign-in, protected routes, campaign visibility, and donation totals after deployment.

Use `migrate dev` for development and `migrate deploy` for production. Keep development and production data separate. The donation interface should clearly indicate when it is recording a demo contribution versus handling a real collection channel.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Prisma reports a missing URL | Root `.env` contains `DIRECT_URL`; `prisma.config.ts` imports `dotenv/config` |
| Generated client import fails | Generator output is `../src/generated/prisma`; run `npx prisma generate` |
| Database connection fails | Copy the full Neon URL, preserve TLS options, and check credentials and network access |
| Migration cannot create a shadow database | Use a database role with suitable permissions or configure a separate development shadow database |
| Clerk pages fail | Keys belong to the same Clerk app; provider, proxy, and catch-all pages exist |
| Admin pages allow ordinary members | Add a server-side local role check; proxy sign-in protection alone is insufficient |
| Tailwind styles do not appear | Preserve the generated PostCSS configuration and global stylesheet import |
| Campaign total is incorrect | Sum only `VERIFIED` donations using database decimals |
| A donation appears twice | Enforce the unique idempotency key and reuse it on retries |

## Documentation

Setup references used for the versioned examples:

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Clerk Next.js quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart)
- [Clerk middleware and route protection](https://clerk.com/docs/reference/nextjs/clerk-middleware)
- [Prisma ORM 7 system requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements)
- [Prisma ORM 7 configuration](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference)
- [Prisma PostgreSQL and Neon connection setup](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)

General references:

- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- [Zod](https://zod.dev/)
- [Neon](https://neon.com/docs)

---

**Lat Tho Lat — Small contributions. Shared impact.**
