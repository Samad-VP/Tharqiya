---
name: prisma-database-guidelines
description: Optimizes deep database interactions, focusing on query efficiency and Prisma features.
author: user
category: database
tags: [prisma, database, postgresql, orm, optimization]
---

# Prisma Database Guidelines

This skill focuses on writing efficient, optimized database queries using the Prisma ORM in the Node.js backend.

## Core Rules

### 1. Avoid N+1 Queries

- When fetching a list of resources that have related data, **always** use Prisma's `include` to fetch relations in a single query.
- Never loop over a recordset in Node.js to fire off additional `findUnique` queries for related records.

### 2. Query Optimization (Selecting Fields)

- Use the `select` object to return only the specific columns needed by the frontend, especially for large tables or models with heavy text fields (like `content` in a `BlogPost`).
- Avoid fetching entire rows (`select *` equivalent) if only a few fields (e.g., `id`, `title`) are required.

### 3. Pagination

- Always implement pagination for queries returning lists of data (e.g., `getPrograms`, `getBlogPosts`) using Prisma's `take` (limit) and `skip` (offset) options, or cursor-based pagination for larger datasets.
- Ensure the API can accept `page` and `limit` query parameters.

### 4. Transactions and Errors

- Use Prisma's interactive or sequential transactions (`prisma.$transaction`) when performing multiple dependent database write operations to ensure atomicity.
- Handle Prisma-specific error codes gracefully in catch blocks (e.g., catching exactly `P2002` for unique constraint violations instead of throwing a generic 500 error).
