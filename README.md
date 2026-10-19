# VideoForge AI

An open-source AI video generation platform built with Next.js, PostgreSQL, Drizzle ORM, and Replicate-powered inference.

## Features

- Prompt-to-video generator UI
- Multi-model support for open-source video models
- Long-form generation simulation and job polling
- PostgreSQL persistence via Drizzle
- Community gallery and generation history
- Optional Replicate integration for real model execution

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL + Drizzle
- Replicate API

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Postgres database and set `DATABASE_URL` in your environment.
3. Start the app:
   ```bash
   npm run dev
   ```
4. Optionally configure `REPLICATE_API_TOKEN` to enable real inference.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`

## License

Apache 2.0
