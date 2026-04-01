---
name: ui-ux-best-practices
description: Ensures perfect accessibility (a11y), visual hierarchy, and intuitive user interactions.
author: user
category: design
tags: [ui, ux, accessibility, a11y]
---

# UI/UX Best Practices

This skill ensures the creation of an intuitive, accessible, and user-centric interface for the Ansar College platform.

## Core Rules

### 1. Accessibility (a11y)

- Enforce strict WCAG accessibility standards.
- Ensure proper contrast ratios for all text and interactive UI elements against their backgrounds.
- Provide descriptive `aria-` attributes (e.g., `aria-label`, `aria-hidden`, `aria-expanded`) for complex components and elements without visible text.
- Guarantee full keyboard navigability; focus states must be highly visible and logical.

### 2. Visual Hierarchy

- Provide a clear, unmistakable visual hierarchy to guide the user's eye.
- Use established typography scales and spacing systems consistently across all pages.
- Group related content effectively using whitespace rather than relying solely on borders or backgrounds.

### 3. Feedback and States

- Implement consistent loading states (e.g., skeleton loaders) to manage user expectations during data fetching.
- Design clear, non-intrusive error handling UI (e.g., toast notifications, inline validation messages).
- Provide immediate visual feedback for all user actions (hover, active, disabled, loading states on buttons).

### 4. Localization

- Support bilingual localization seamlessly (English and Malayalam).
- Ensure UI layouts do not break when text direction or length changes significantly between languages.
