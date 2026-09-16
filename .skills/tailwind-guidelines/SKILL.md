---
name: tailwind-guidelines
description: Ensures clean, maintainable Tailwind CSS styling, focusing on utility grouping and design systems.
author: user
category: styling
tags: [tailwind, css, styling, design-system]
---

# Tailwind CSS Guidelines

This skill ensures clean, maintainable, and highly consistent styling across the project using Tailwind CSS.

## Core Rules

### 1. Utility Class Discipline

- Strictly avoid inline styles (`style={{}}`). Tailwind utilities should handle 99% of styling needs.
- If a component requires a massive list of classes, abstract the _structure_ into smaller React components rather than relying heavily on `@apply` in CSS files, keeping the design system visible in the markup.
- For extremely complex, conditionally applied classes, use formatting utilities like `clsx` or `tailwind-merge` to prevent conflicts.

### 2. Logical Grouping

- Group utility classes logically to improve readability. A suggested order:
  1. Base and alignment (`block`, `flex`, `items-center`)
  2. Sizing (`w-full`, `h-64`)
  3. Spacing (`p-4`, `mt-2`)
  4. Typography (`text-lg`, `font-bold`)
  5. Backgrounds and Borders (`bg-white`, `border-gray-200`)
  6. Effects and Transitions (`shadow-md`, `transition-all`)

### 3. Responsive Modifiers

- Always use responsive modifiers (`sm:`, `md:`, `lg:`) in a mobile-first manner.
- Do not mix directional responsive mapping (e.g., setting a style on `md:` and trying to undo it on `lg:` if a base class would suffice).

### 4. Design System Adherence

- Rely on the project's extended `tailwind.config.ts` for colors, fonts, and spacing.
- Do not use arbitrary values (e.g., `text-[#123456]`, `w-[325px]`) unless absolutely necessary for a one-off placement. Rely on the configured theme tokens.
