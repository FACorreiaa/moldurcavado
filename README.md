# Moldurcavado Website

A modern, localized website for Moldurcavado Molduras, Lda.

## Features

- **Portfolio Showcase**: Instagram-like feed for wood frames and canvas works.
- **Engagement**: Users can like and comment on portfolio items (anonymous).
- **i18n**: Full support for Portuguese (PT) and English (EN) with subpath routing.
- **Theme**: Dark and Light mode support with system preference detection.
- **Stack**: Next.js (App Router), Tailwind CSS 4, Drizzle ORM, Vercel Postgres.

## Setup

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```
3.  **Environment Variables**:
    Copy `.env.example` to `.env.local` and fill in your Vercel Postgres credentials.
4.  **Database Migration**:
    ```bash
    pnpm drizzle-kit push
    ```
5.  **Run Development Server**:
    ```bash
    pnpm dev
    ```

## Development

- **Drizzle Studio**: Run `pnpm drizzle-kit studio` to view and edit database data.
- **Translations**: Edit `dictionaries/pt.json` and `dictionaries/en.json`.

## Deployment

This project is optimized for deployment on **Vercel**. Ensure you connect a Vercel Postgres database to your project in the Vercel Dashboard.
