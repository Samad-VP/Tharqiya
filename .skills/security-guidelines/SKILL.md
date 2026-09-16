---
name: security-guidelines
description: Secures the full-stack application, focusing on Express middleware, JWT handling, and input sanitization.
author: user
category: security
tags: [security, express, cors, helmet, jwt]
---

# Security Guidelines

This skill enforces strict security measures for the Express.js backend API and the interaction point with the frontend.

## Core Rules

### 1. HTTP Headers & CORS

- The backend application must always use `helmet()` middleware to set essential HTTP security headers (e.g., mitigating XSS, hiding `X-Powered-By`).
- Implement strict CORS configuration. Ensure the `cors()` middleware is configured to only allow requests from explicit, trusted frontend origins (e.g., the Next.js URL) in production.

### 2. Authentication & JWT Handling

- Securely create, sign, and verify JSON Web Tokens (JWTs) using strong, complex environment variables (`JWT_SECRET`).
- Set appropriate token expiration times (`expiresIn` e.g., '1h' or '7d').
- When sending a JWT to the client, strongly prefer HttpOnly, Secure, SameSite cookies over storing the token in LocalStorage, as it mitigates XSS risks.

### 3. Input Sanitization & SQL Injection (ORM)

- Sanitize and validate all user inputs (req.body, req.query, req.params) before proceeding with logic.
- Because Prisma is used, raw SQL is typically avoided. However, if using `$queryRaw`, _never_ interpolate variables directly into the SQL string template literal. Always use parameterized queries provided by Prisma's tagged template function.

### 4. Error Handling

- Never expose sensitive backend stack traces or internal database error messages to the client API response in production.
- Implement a global error-handling middleware in Express to catch unhandled application errors and send generic, safe error messages to the frontend while logging the actual error internally sequence.
