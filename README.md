# HQ: Inventory & Onboarding (ERP System)

**HQ** is a comprehensive, internal **Enterprise Resource Planning (ERP)** system built as a modern web application for Osoft. It centralizes key operational processes, reduces administrative friction, and provides a single source of truth for both new hires and long-term employees.

## Core Modules

### 1. Automated Onboarding Guide
A public-facing portal designed to provide a consistent and professional introduction to the company.
*   **Company Vision & Mission:** Aligning team members with Osoft's goals.
*   **Meet the Founders:** Deep dives into the leadership team's background and strategic vision.
*   **Organizational Map:** Detailed department profiles and Head of Department (HOD) information.

### 2. Role-Based Inventory Management
A secure, permission-sensitive module for managing company assets.
*   **Staff View:** Browse the catalog, manage a personal request cart, and track "My HQ" assigned items.
*   **Admin View:** Manage stock levels, add/edit/delete items, and approve/decline requests for assigned categories.
*   **Super Admin View:** Full system oversight, including personnel management (promoting/demoting users) and organization-wide inventory logs.

---

## Key Features

-   **Dynamic Approval Workflow:** Automated routing of resource requests to designated admins.
-   **Compulsory Transparency:** Admins are required to provide detailed reasoning when declining requests to ensure actionable feedback and reduce operational friction.
-   **Real-time Notifications:** In-app visual cues for request status updates (Pending, Approved, Declined).
-   **Personnel Management:** Super admins can manage user roles and assign specific inventory categories to admins.
-   **Personalized Dashboard:** "My HQ" profile page showing active assets and recent request history.
-   **Responsive Design:** Optimized for seamless usage on both mobile and desktop.

---

## Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Frontend:** [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Backend Logic:** Next.js Server Actions
*   **Authentication:** [Firebase Auth](https://firebase.google.com/products/auth) (Google & Email/Password)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## Architecture

HQ uses a modern, server-first architecture:
-   **Server Actions:** All data mutations and logic (login, requests, stock updates) are handled via secure server-side functions.
-   **Role-Based Access Control (RBAC):** UI elements and routes are dynamically rendered/protected based on the user's role.
-   **Data-Agnostic Design:** For the MVP, data is managed via a mock in-memory database (`/lib/data.ts`), designed for seamless integration with production databases like Firestore.
