---
name: cloudinary-media-management
description: Standardizes image/video uploads, transformations, and delivery using Cloudinary.
author: user
category: media
tags: [cloudinary, media, images, video, optimization]
---

# Cloudinary Media Management

This skill dictates how media assets (images, PDFs, documents) should be handled within the Ansar College application using the Cloudinary SDK.

## Core Rules

### 1. Folder Structure

- Always upload assets to specific, clearly categorized folders in Cloudinary to maintain organization (e.g., `ansar-college/programs`, `ansar-college/gallery`, `ansar-college/blog`).
- Never upload everything to the root directory.

### 2. Dynamic Transformations

- Never deliver raw, original high-resolution assets directly to the frontend if they are going to be displayed as standard web images.
- Utilize Cloudinary's dynamic transformation URLs (or the Next.js Cloudinary loader) to automatically resize, crop, and format images on the fly.
- Mandatorily apply auto-format (`f_auto`) and auto-quality (`q_auto`) to all standard image deliveries for optimal performance and WebP/AVIF support.

### 3. Secure Uploads

- All direct uploads to Cloudinary must be done securely server-side (within Express controllers) where the `CLOUDINARY_API_SECRET` is safely accessible.
- If client-side uploads are strictly necessary for UX reasons, you _must_ use strict signed upload configurations generating signatures on the backend.
- Never expose API secrets or direct unsigned upload presets in the Next.js frontend code.
