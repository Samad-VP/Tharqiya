---
name: api-design-guidelines
description: Structures backend Express API for high quality, predictability, and standardized responses.
author: user
category: backend
tags: [express, api, rest, nodejs, backend]
---

# API Design Guidelines

This skill dictates how the Express.js backend API should be structured for maximum reliability, predictability, and ease of use by the frontend.

## Core Rules

### 1. RESTful Principles

- Endpoints must follow RESTful naming conventions based on resources (e.g., `/api/users`, `/api/programs/:id`).
- Use the correct HTTP methods:
  - `GET`: For retrieving data.
  - `POST`: For creating new resources.
  - `PUT` / `PATCH`: For updating resources.
  - `DELETE`: For removing resources.

### 2. Predictable Responses

- Standardize the JSON response format for the entire API.
- **Success**: Return the resource directly or wrapped in a `data` object. Use appropriate success statuses (`200 OK`, `201 Created`).
- **Error**: Return a consistent error structure. For example: `res.status(400).json({ message: "Invalid input", error: details })`. Use appropriate error statuses (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`).

### 3. Input Validation

- Strictly validate all incoming request bodies, queries, and parameters _before_ processing them in controllers.
- Use establishing libraries (like Zod or Joi) or robust manual checks. Never assume `req.body` is safe or complete.

### 4. Controller Modularity

- Keep route files (`routes/`) focused solely on URL paths and middleware chaining.
- Keep controllers (`controllers/`) focused on handling the request, invoking business logic, and sending the response (`req`, `res`).
- If business logic becomes complex, abstract it into separate service files to maintain clean controllers.
