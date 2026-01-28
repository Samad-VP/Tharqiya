# Tharqiya Admission Management System - Project Overview

## 1. Introduction

Tharqiya is a comprehensive Admission and Student Management System designed for educational institutions. It facilitates the entire lifecycle of a student's admission, from public application to interview scheduling, evaluation, and final allotment.

## 2. Technology Stack

### Frontend

- **Framework**: React.js with TypeScript (Vite)
- **Styling**: Tailwind CSS for a responsive, modern UI.
- **Animations**: Framer Motion for smooth transitions and interactive elements.
- **Icons**: Lucide React.
- **State Management/Data Fetching**: Axios for API calls, React Context for Auth state.
- **Routing**: React Router DOM.
- **Notifications**: React Hot Toast.

### Backend

- **Runtime**: Node.js with TypeScript.
- **Framework**: Express.js.
- **Database**: PostgreSQL (hosted on Supabase/Direct Postgres).
- **ORM**: Prisma for type-safe database access and migrations.
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` for password hashing.
- **File Uploads**: Multer with Cloudinary for secure image and document storage.
- **Mailing**: Nodemailer for email notifications.
- **Validation**: Manual validation and Express middleware.

### Infrastructure & DevOps

- **Docker**: Containerized environment for consistent development and deployment.
- **CI/CD**: GitHub Actions for automated testing and deployment.
- **Deployment**: Vercel ready for the frontend, Node.js environment for the backend.

## 3. Core Modules & Functionalities

### Authentication & RBAC (Role-Based Access Control)

- **Roles**: SUPER_ADMIN, ADMIN, PRINCIPAL, INTERVIEWER, STUDENT.
- **Features**: JWT-based logout/login, password hashing, Forgot Password with OTP (Email/WhatsApp), forced password change on first login.

### Admission Management

- **Public Application**: A multi-step form for prospective students. Application records are created without a user account initially.
- **Verification Flow**: Admins verify documents and approve applications.
- **Account Generation**: Upon admin approval, the system automatically generates a `User` account, creates credentials, and notifies the applicant via WhatsApp/Email.

### Interview & Evaluation System

- **Scheduling**: Admins can schedule interviews and assign specific interviewers to applicants.
- **Evaluation**: Interviewers can score students across different subjects and provide qualitative remarks.
- **Status Updates**: Automated status transitions based on evaluations.

### User & Student Profile Management

- **Profile Images**: Strictly limited to 300KB, 600x600 dimensions, and auto-converted to WebP for optimization.
- **Documents**: PDF-only uploads for certificates and ID proofs, limited to 2MB.
- **Asset Replacement**: Automated deletion of old Cloudinary assets when a user replaces their profile image or documents to save storage on the free tier.

### Result & Allotment Engine

- **Result Generation**: Calculation of average marks and final decision (Accepted/Rejected).
- **Allotment**: Automated or manual assignment of students to specific campuses and courses based on their preferences and merit.

### Dashboards & Portals

- **Admin Dashboard**: Overview of statistics (Total applications, pending interviews, etc.) and management of all system entities.
- **Interviewer Portal**: View assigned interviews and submit evaluations.
- **Student Portal**: Personal dashboard for students to track their application status, download results/application PDFs, and view resources.
- **Principal Dashboard**: Executive-level overview for institutional heads.

## 4. Database Architecture (Prisma Schema)

- **User**: Base model for all authenticated users.
- **Student**: Extended profile for applicants, linked to a User account.
- **Application**: Tracks the lifecycle of an admission request.
- **Allotment**: Stores campus and course assignment details.
- **Interview & Evaluation**: Models for managing the assessment process.
- **AuditLog**: Tracks critical administrative actions for security.
- **Notification**: History of sent alerts.
- **Setting**: Global system configurations (e.g., admission deadlines).

## 5. Directory Structure

- `/backend`: Contains the Node.js API server.
  - `/src/controllers`: Business logic for each endpoint.
  - `/src/routes`: API route definitions.
  - `/src/middleware`: Auth protection, file upload logic, and error handling.
  - `/prisma`: Database schema and migrations.
- `/frontend`: Contains the React application.
  - `/src/pages`: Individual page components (Admin, Student, etc.).
  - `/src/components`: Reusable UI elements and layouts.
  - `/src/context`: Auth context provider.
