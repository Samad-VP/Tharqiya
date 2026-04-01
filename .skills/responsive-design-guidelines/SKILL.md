---
name: responsive-design-guidelines
description: Guarantees a flawless experience across all device sizes using a mobile-first approach.
author: user
category: design
tags: [responsive, mobile-first, tailwind]
---

# Responsive Design Guidelines

This skill guarantees that the Ansar College website provides a flawless user experience across all device sizes, from mobile phones to large desktop monitors.

## Core Rules

### 1. Mobile-First Approach

- **Always** design and style for mobile screens first.
- Use Tailwind CSS's default breakpoint utility structure progressively (`sm:`, `md:`, `lg:`, `xl:`).
- _Never_ write desktop styles and then attempt to patch them for mobile using `max-width` queries.

### 2. Touch and Navigation

- Test and verify touch targets on mobile devices. Clickable elements must have a minimum size of 44x44px.
- Optimize navigation specifically for mobile screens (e.g., implement hamburger menus, accessible bottom sheets, or off-canvas drawers).
- Ensure horizontal scrolling is disabled on the `body` and `html` tags.

### 3. Fluidity

- Ensure fluid typography that scales smoothly between breakpoints, avoiding jarring jumps in font size.
- Use scalable padding and margins (e.g., using `clamp()` or relative units where appropriate, or consistent Tailwind spacing utilities).
- Images and media containers must be 100% responsive and never break out of their parent containers.
