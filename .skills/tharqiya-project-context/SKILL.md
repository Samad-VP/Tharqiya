---
name: tharqiya-project-context
description: Project-specific context and rules for Tharqiya Admission Management System.
author: user
category: context
tags: [tharqiya, admission-management, backend, frontend, prisma]
---

# Tharqiya Project Context

This skill provides specific context for the Tharqiya Admission Management System development, ensuring the agent understands the project's unique requirements.

## Core Pillars

- **Admission Management**: A comprehensive system for managing student applications, interviews, and allotments.
- **Audience**: Prospective students, administrative staff, principals, and interviewers.
- **Roles**: High granularity with SUPER_ADMIN, ADMIN, PRINCIPAL, INTERVIEWER, and STUDENT roles.
- **Tone**: Professional, user-friendly, and efficient, with a premium modern aesthetic.

## Technical Architecture

- **Frontend**: React.js with TypeScript (Vite) and Tailwind CSS.
- **Backend**: Node.js/Express with TypeScript.
- **Database**: PostgreSQL managed via Prisma ORM.
- **Authentication**: JWT-based login with RBAC (Role-Based Access Control).
- **Assets**: Cloudinary for optimized image and document storage.

## Project-Specific Rules

- **Image Optimization**: Strictly limit profile images to 300KB and auto-convert to WebP.
- **Document Handling**: PDF-only uploads for certificates, limited to 2MB.
- **Audit Logging**: Ensure critical administrative actions are logged in the `AuditLog` table.
- **Premium UI**: Use elegant Tailwind utilities, Framer Motion animations, and a cohesive color palette.
- **Scalability**: Maintain strict type safety across the entire stack for long-term maintainability.
