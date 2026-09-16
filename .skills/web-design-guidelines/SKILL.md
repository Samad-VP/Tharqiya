---
name: web-design-guidelines
description: Guidelines for web interface design, including accessibility, performance, and user experience.
author: vercel
category: design
tags: [design, accessibility, ux, performance]
---

# Web Design Guidelines

Guidelines for ensuring digital interfaces meet high standards for usability, accessibility, and design integrity.

## Focus Areas

### 1. Accessibility (a11y)

- Use semantic HTML elements (`<main>`, `<nav>`, `<header>`, etc.).
- Ensure proper contrast ratios for text and UI elements.
- Provide ARIA labels where necessary, especially for interactive elements without text.
- Support keyboard navigation for all interactive components.

### 2. Performance

- Optimize images (use WebP/AVIF, use `next/image` in Next.js).
- Minimize layout shifts (CLS).
- Lazy load non-critical resources.

### 3. User Experience (UX)

- Provide clear feedback for user actions (hover states, loading indicators).
- Maintain consistent spacing and typography.
- Ensure the interface is responsive across all device sizes.

## Source

Rules maintained in the [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) repository.
