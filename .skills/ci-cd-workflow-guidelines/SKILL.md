---
name: ci-cd-workflow-guidelines
description: Establishes rules for Continuous Integration and Continuous Deployment pipelines.
author: user
category: devops
tags: [ci, cd, github-actions, devops, workflow]
---

# CI/CD Workflow Guidelines

This skill governs the automated processes for code integration, testing, and deployment to ensure stability across the Tharqiya codebase.

## Core Rules

### 1. Pre-Deployment Checks

- Any automated deployment pipeline (e.g., Vercel builds or GitHub Actions) must execute strict pre-checks before building.
- Require successful strict type-checking (`tsc --noEmit`) to catch TypeScript errors.
- Require successful linting (`eslint .`) to enforce code style and catch potential bugs.

### 2. Database Validation in CI

- The CI pipeline must validate the Prisma schema using `npx prisma validate`.
- Ensure that the Prisma Client can be generated successfully (`npx prisma generate`) in the CI environment to confirm there are no platform-specific binary issues.

### 3. Branch Protection

- The `main` (or `production`) branch must be heavily protected.
- Never push code directly to `main`.
- All features and fixes must go through Pull Requests (PRs).
- PRs must require passing status checks (linting, type-checking, tests if applicable) before they can be merged.
