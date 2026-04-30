# Authentication Implementation & Learning Log

This document serves as a detailed learning log of our work implementing user authentication with NextAuth.js (Auth.js v5) and Prisma in your Next.js application.

---

## 1. Initial Authentication Setup

**My Prompt:**
> "I need to implement user authentication. Help me understand how this is set up in a nextjs application using prisma. Guide me through step by step and give me material so I can read further"

**The Issue:**
Setting up modern authentication in a Next.js App Router application requires multiple moving parts, including database models, middleware for edge routing, and specialized configuration files to avoid bundling heavy database libraries into edge functions.

**The Technical Solution:**
We implemented the industry-standard Auth.js (v5) with the Prisma adapter. 
1. We added the required NextAuth tables (`User`, `Account`, `Session`, `VerificationToken`) to `schema.prisma`.
2. We created a singleton Prisma client in `packages/db/src/client.ts` to prevent connection exhaustion in development.
3. We created `apps/web/auth.config.ts` (lightweight Edge config) and `apps/web/auth.ts` (main config with PrismaAdapter).
4. We set up the API route at `api/auth/[...nextauth]/route.ts`.
5. We implemented `middleware.ts` to protect routes and a premium UI at `app/login/page.tsx`.

**Resources:**
* [Auth.js Getting Started](https://authjs.dev/getting-started)
* [Auth.js Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma)
* [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## 2. Understanding Database Types (SQLite vs PostgreSQL)

**My Prompt:**
> "I still didn't initialize the postgresql database, how will the website have access to the database and where will it be stored?"

**The Issue:**
We started development without a database server running. There was confusion over how the app was storing data if PostgreSQL wasn't initialized yet.

**The Technical Solution:**
We clarified that the initial setup used **SQLite** (`provider = "sqlite"`). SQLite is a file-based database that stores all data in a local file (`dev.db`). We explained the difference between this and **PostgreSQL**, which requires a dedicated server process (either running locally via Docker or hosted in the cloud like Vercel Postgres).

---

## 3. Connecting to Vercel Postgres

**My Prompt:**
> "How do I do that with Vercel?" *(Referring to switching from SQLite to Vercel Postgres)*

**The Issue:**
You needed to switch your database engine from local SQLite to a cloud-hosted Vercel PostgreSQL database to prepare for production.

**The Technical Solution:**
We updated `schema.prisma` to use `provider = "postgresql"`. We configured it to use two specific environment variables provided by Vercel:
* `POSTGRES_PRISMA_URL` for connection pooling (used by the running app).
* `POSTGRES_URL_NON_POOLING` for direct connections (used by Prisma CLI for migrations).
We outlined the steps to provision the database in the Vercel Storage Dashboard and copy the `.env.local` variables into your local `.env` file.

---

## 4. Vercel Security & Reauthentication

**My Prompt:**
> "What is the passkey or how do I enter a recovery code?" *(Accompanied by a screenshot of a Vercel Reauthenticate prompt)*

**The Issue:**
While trying to provision the database or view environment variables in Vercel, you encountered a security prompt asking for a Passkey or Recovery Code.

**The Technical Solution:**
We identified this as a standard WebAuthn/2FA security feature from Vercel (or GitHub). The "Passkey" refers to device-level biometrics (Windows Hello, Face ID, Fingerprint) or a password manager prompt that verifies your identity before allowing highly sensitive actions. A "Recovery Code" is one of the permanent backup codes generated when you first enabled 2FA on the account.

---

## 5. Fixing Prisma 7 Breaking Changes

**My Prompt:**
> "Error: Prisma schema validation - (get-config wasm) Error code: P1012 error: The datasource property `url` is no longer supported in schema files..."

**The Issue:**
When attempting to push the database, the Prisma CLI crashed. This happened because Prisma version 7 introduced a major breaking change: database URLs can no longer be defined directly inside `schema.prisma`.

**The Technical Solution:**
To comply with Prisma 7 standards:
1. We completely removed the `url` and `directUrl` lines from `schema.prisma`.
2. We created a new file, `prisma.config.ts`, which tells the Prisma CLI where to find your database URL during migrations.
3. We updated the Prisma instantiation in `client.ts` to explicitly pass `datasourceUrl: process.env.POSTGRES_PRISMA_DATABASE_URL` into the `new PrismaClient()` constructor so the running application knows how to connect.

**Resources:**
* [Prisma 7 Client Config Documentation](https://pris.ly/d/prisma7-client-config)
* [Prisma 7 Datasource Configuration](https://pris.ly/d/config-datasource)

---

## 6. Prototyping vs. Production Migrations

**My Prompt:**
> "Should I do now I migration when I change something? And then push it to vercel?"

**The Issue:**
After successfully running `npx prisma db push`, you needed to understand the long-term workflow for managing database changes safely.

**The Technical Solution:**
We established the difference between prototyping and production workflows:
* **Prototyping (`db push`)**: Forces the database to match the schema immediately. Great for fast iteration, but dangerous for production as it can silently delete data if tables/columns change.
* **Production (`migrate dev`)**: Generates tracked `.sql` files (`prisma/migrations/*.sql`). These files are committed to Git, and Vercel runs `npx prisma migrate deploy` during the build to safely apply changes without data loss.

---

## 7. Database Structure vs. Database Data

**My Prompt:**
> "What is the difference between seed and push?"

**The Issue:**
Vercel's instructions mentioned running both a migration/push and a seed command. You needed to understand the distinct purpose of each.

**The Technical Solution:**
* **`db push` / `migrate` (Structure)**: These commands create the empty "containers" (tables, columns, relationships) based on your schema.
* **`db seed` (Data)**: This command fills those empty containers with initial data or dummy information (e.g., test users, default admin accounts, or lookup tables).

---

## 8. Creating and Running a Seed Script

**My Prompt:**
> "Yes create a seed.ts file, add also comments, then tell me how to run the migration and what else I should do"

**The Issue:**
You needed a functional database seed script to generate a test user, as well as the configuration to run it.

**The Technical Solution:**
1. We created `packages/db/prisma/seed.ts` and wrote a script using Prisma's `upsert` method. `upsert` is a best practice for seeding because it safely creates the user if they don't exist, but does nothing if they already exist (preventing crashes on subsequent runs).
2. We updated `packages/db/package.json` to include `"prisma": { "seed": "npx tsx prisma/seed.ts" }`, which links the Prisma CLI to your script.

---

## 9. Resolving Migration "Drift"

**My Prompt:**
> "Drift detected: Your database schema is not in sync with your migration history... We need to reset the public schema..."

**The Issue:**
When you ran `migrate dev` for the first time after having previously used `db push`, Prisma panicked. It saw tables in the database but had no `.sql` files proving how they got there, which it calls "drift."

**The Technical Solution:**
We verified that because this was a brand-new database with no real user data, it was 100% safe to accept the reset prompt. Prisma temporarily dropped the tables, generated the initial `.sql` file, recreated the tables properly, and synced the migration history perfectly.

---

## 10. Fixing Next.js Build Import Error

**My Prompt:**
> "Type error: File '/vercel/path0/apps/web/src/app/login/page.tsx' is not a module."

**The Issue:**
Your Vercel deployment failed during the TypeScript checking phase. The error indicated that Next.js couldn't parse the `login/page.tsx` file as a valid module.

**The Technical Solution:**
We discovered a relative path typo in `page.tsx`. The import statement `import { signIn } from '../../../../../auth';` had too many directory leaps (`../`) and was trying to look outside of the `apps/web` folder entirely. We corrected the path to `import { signIn } from '../../../auth';`, which successfully pointed to the `auth.ts` file located in the root of the web app, allowing Vercel to build successfully.

---

## 11. Fixing Vercel Monorepo Build Error

**My Prompt:**
> "I've changed the build in the package.json and now I get this error... sh: line 1: prisma: command not found Error: Command 'npm run build' exited with 127"

**The Issue:**
You updated your Vercel build command in `apps/web/package.json` to `prisma generate && prisma migrate deploy && next build`. However, because this is a monorepo, the Prisma CLI (`prisma`) is installed in `packages/db`, not inside `apps/web`. Vercel's build process inside `apps/web` didn't know where to find the `prisma` command.

**The Technical Solution:**
We modified the build script to change directories (`cd`) into the `packages/db` folder, run the Prisma generation and migrations from there using `npx`, and then return to the `apps/web` folder to run the standard Next.js build.
* **Old Script:** `"build": "prisma generate && prisma migrate deploy && next build"`
* **New Script:** `"build": "cd ../../packages/db && npx prisma generate && npx prisma migrate deploy && cd ../../apps/web && next build"`
This safely guarantees the migrations deploy properly before the web app builds.

---

## 12. Fixing Missing @prisma/client in Monorepo

**My Prompt:**
> "npm warn exec The following package was not found... Error: Could not resolve @prisma/client... Fix and update @[AUTH_IMPLEMENTATION_LOG.md]"

**The Issue:**
Even though we directed Vercel to run `prisma generate` inside the `packages/db` directory, the build failed because `@prisma/client` couldn't be resolved. This happened because in our monorepo setup, you installed `@prisma/client` exclusively inside `apps/web/package.json`. When the Vercel build script navigated into `packages/db` to run the generation, it didn't have local access to the client package needed by the `prisma.config.ts` configuration.

**The Technical Solution:**
We updated the Vercel build script in `apps/web/package.json` to explicitly install the Prisma client right before running the generation. 
* **Old Script:** `"build": "cd ../../packages/db && npx prisma generate && npx prisma migrate deploy && cd ../../apps/web && next build"`
* **New Script:** `"build": "cd ../../packages/db && npm install @prisma/client && npx prisma generate && npx prisma migrate deploy && cd ../../apps/web && next build"`
By doing this, we guarantee that `@prisma/client` is successfully installed in the `packages/db` context, allowing the schema to compile and generate properly during the Vercel deployment pipeline.

---

## 13. Successful Production Build & Deployment

**My Prompt:**
> "1 migration found in prisma/migrations. No pending migrations to apply. Applying modifyConfig from Vercel. Next.js 16.2.4 (Turbopack). Creating an optimized production build ... Add to the markdown file"

**The Issue / Milestone:**
After resolving the monorepo pathing and dependency issues, we needed to verify that the Vercel build pipeline could successfully execute the database migrations and compile the Next.js application.

**The Technical Solution:**
The terminal output confirms that our final build script is working perfectly! 
1. Prisma successfully located the `init` migration file we created earlier.
2. It verified that the production database on Vercel is already up-to-date (`No pending migrations to apply`).
3. It successfully handed the build process back to Next.js (`Creating an optimized production build ...`).

Our automated continuous integration (CI) pipeline for database migrations and frontend deployments is now fully operational!
