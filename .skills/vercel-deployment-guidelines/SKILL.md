---
name: vercel-deployment-guidelines
description: Enforces best practices for deploying the application ecosystem, specifically tailored to Vercel and Edge networks.
author: user
category: deployment
tags: [vercel, deployment, serverless, edge, caching]
---

# Vercel Deployment Guidelines

This skill enforces practices necessary for stable, high-performance deployments, assuming a Vercel hosting environment for the frontend and serverless backend environments.

## Core Rules

### 1. Environment Variables

- Ensure a strict separation of environment variables.
- Variables required exclusively by the backend or build processes must never be prefixed with `NEXT_PUBLIC_`.
- Variables required by the frontend client-side code _must_ be appropriately prefixed (e.g., `VITE_` for Vite).

### 2. Serverless Database Connections

- When deploying the Express backend to a serverless environment (like Vercel functions), you must handle database connection pooling.
- Serverless functions spin up and down rapidly, which can exhaust PostgreSQL connection limits.
- Ensure the Prisma configuration utilizes a connection pooler (like PgBouncer) or Prisma Accelerate (`prisma://` proxy URL) rather than a direct database connection URL in production.

### 3. Caching and ISR

- Maximize the use of Vercel's Edge Network caching capabilities.
- Implement Incremental Static Regeneration (ISR) for mostly static content that updates occasionally (e.g., Blog Posts, Program Details) using `revalidate` flags in Next.js `fetch` or route segments.
- Cache computationally heavy API responses where appropriate using `Cache-Control` headers.
