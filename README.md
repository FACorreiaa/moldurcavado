# Moldurcavado Website

A modern, localized website for Moldurcavado Molduras, Lda.

## Features

- **Portfolio Showcase**: Responsive grid of wood frames and canvas works with anonymous likes.
- **Contact**: Persisted contact form (DB + email via Resend) with honeypot + per-IP throttle.
- **i18n**: Portuguese (PT) and English (EN) with subpath routing.
- **Theme**: Dark and Light mode with system preference detection and WCAG AA-tuned palette.
- **Stack**: Next.js (App Router), Tailwind CSS 4, Drizzle ORM, Vercel Postgres, Vercel Blob, Resend.

## Local Setup

1. **Clone the repository**.
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Environment variables**:
   Copy `.env.example` to `.env.local` and fill in:
   - `POSTGRES_*` — from Vercel Postgres (or `vercel env pull`).
   - `ADMIN_USER` / `ADMIN_PASS` — credentials for `/[lang]/admin`.
   - `RESEND_API_KEY` — from <https://resend.com/api-keys>.
   - `CONTACT_TO_EMAIL` — inbox that receives contact form messages.
   - `CONTACT_FROM_EMAIL` — verified Resend sender (e.g. `no-reply@yourdomain.com`).
4. **Apply migrations**:
   ```bash
   pnpm drizzle-kit migrate
   ```
5. **Run dev server**:
   ```bash
   pnpm dev
   ```

## Development

- **Drizzle Studio**: `pnpm drizzle-kit studio` to view/edit DB data.
- **New migration**: edit `db/schema.ts`, then `pnpm drizzle-kit generate --name=your_change`.
- **Translations**: edit `dictionaries/pt.json` and `dictionaries/en.json`.
- **Contact info placeholders**: live in `dictionaries/{en,pt}.json` under `contact.info.*Value`.

## Deploying to Production (Vercel)

1. **Push the branch and open a PR** (or push directly to `main`).
2. **Vercel project setup** (one-time):
   - Connect this repo on <https://vercel.com>.
   - Attach a **Vercel Postgres** database — it auto-injects the `POSTGRES_*` env vars.
   - Storage → connect **Vercel Blob** (already used by admin uploads).
3. **Resend setup** (one-time):
   - Create account at <https://resend.com>, verify your sending domain.
   - Create an API key.
   - Add a sender address on the verified domain (`no-reply@yourdomain.com`).
4. **Set production environment variables** in Vercel → Project → Settings → Environment Variables (scope = Production):
   - `ADMIN_USER`, `ADMIN_PASS` — pick strong values.
   - `RESEND_API_KEY` — the Resend key.
   - `CONTACT_TO_EMAIL` — your real inbox (e.g. `info@moldurcavado.pt`).
   - `CONTACT_FROM_EMAIL` — verified Resend sender on your domain.
   - Update the dictionary placeholders (`dictionaries/{en,pt}.json` → `contact.info.*Value`) with the real phone, mobile, address, and hours, then commit.
5. **Apply migrations against the production DB** (run locally, pointed at prod):
   ```bash
   vercel env pull .env.production.local
   cp .env.production.local .env
   pnpm drizzle-kit migrate
   ```
   This applies `drizzle/0001_add_contact_messages.sql` (and any future migrations).
   Alternatively, run `pnpm drizzle-kit push` once against the prod URL if you prefer schema-sync over file-based migrations.
6. **Deploy**:
   - Merge to `main` → Vercel auto-builds and deploys.
   - Or run `vercel --prod` from the CLI.
7. **Post-deploy smoke test**:
   - Visit `/pt` and `/en` — toggle theme, walk every section.
   - Submit the contact form with a real email → verify the row in `contact_messages` (Drizzle Studio) and the inbox in `CONTACT_TO_EMAIL`.
   - Submit twice in 60s → expect rate-limit error message.
   - Hit `/admin` → basic-auth prompt; upload a portfolio image → verify it appears on the home page.

## Notes

- **Email failures**: the contact action persists the DB row *before* calling Resend, so a failed send still leaves an auditable message — check the `contact_messages` table if email delivery is flaky.
- **Rate limit**: in-memory per-IP (60s window). Resets on every deploy / serverless cold start — fine for a small-business site, swap to Upstash if abuse becomes an issue.
- **GDPR**: submitter IPs are SHA-256 hashed before storage, not stored raw.
