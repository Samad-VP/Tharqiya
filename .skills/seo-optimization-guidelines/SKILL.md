---
name: seo-optimization-guidelines
description: Maximizes search engine visibility using Next.js Metadata, structured data, and semantic HTML.
author: user
category: optimization
tags: [seo, metadata, performance]
---

# SEO Optimization Guidelines

This skill is designed to maximize search engine visibility, correct meta tagging, and ensure high performance scores for the Ansar College website.

## Core Rules

### 1. Comprehensive Metadata

- Utilize the Next.js `Metadata` API comprehensively on _every_ page.
- Define accurate and unique `title` and `description` tags for every route.
- Implement OpenGraph (`og:`) and Twitter Card metadata for optimal sharing on social platforms.
- Set canonical URLs appropriately.

### 2. Semantic Structure

- Ensure a rigorous semantic HTML structure across the document (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Maintain a strictly correct heading hierarchy. Every page must have exactly one `<h1>`. Headings (`<h2>` through `<h6>`) must not skip levels.

### 3. Structured Data

- Implement structured data (Schema.org JSON-LD) where applicable.
- Key schemas to include: `EducationalOrganization` (for the college itself), `Course/Program` (for the Hifz programs), and `BreadcrumbList`.

### 4. Core Web Vitals

- Enforce strict adherence to optimizing Core Web Vitals.
- Minimize Cumulative Layout Shift (CLS) by providing explicit dimensions for images and ad spaces.
- Optimize Largest Contentful Paint (LCP) by prioritizing hero images and critical CSS.
- Ensure Fast First Input Delay (FID) / Interaction to Next Paint (INP) by keeping the main thread free and deferring non-critical JavaScript.
