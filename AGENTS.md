<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Agent Rules & Coding Standards

This document outlines the strict guidelines, tech stack, and conventions that all AI agents must follow when writing or modifying code in this project. Do not break the Next.js layer and default setup.

## 1. Tech Stack

When working on this frontend project, ALWAYS adhere to the following technologies:

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Primitives**: Radix UI
- **Icons**: Lucide React (`lucide-react`)
- **State Management**: Zustand (`zustand`)
- **Data Fetching & Mutations**: TanStack React Query (`@tanstack/react-query`)
- **Form Handling**: React Hook Form (`react-hook-form`)
- **Schema Validation**: Zod (`zod`)

## 2. Architecture & File Structure

This project organizes files by **type** rather than by feature, while respecting the Next.js App Router structure. Always place new files in the appropriate directory under `src/` (create it if it doesn't exist):

- `app/` - Next.js App Router structure (pages, layouts, API routes). Do not alter the base Next.js setup. Place this at the project root, not inside `src/`.
- `src/components/` - Reusable React components (including Radix UI wrappers).
- `src/hooks/` - Custom React hooks and React Query hooks.
- `src/utils/` - Utility functions, helpers, and Zod schemas.
- `src/store/` - Zustand state stores.

## 3. Coding Conventions

- **Exports**: Prefer **default exports** for components and pages (e.g., `export default function MyComponent() { ... }`).
- **Next.js Conventions**: Do not break Next.js SSR or server components layer. Explicitly use `'use client'` at the top of the file when using client-side hooks like `useState`, `useForm`, or Zustand stores.
- **Styling Approach**: Build layouts and style components strictly using Tailwind CSS utility classes.
- **Accessibility**: Use Radix UI primitives as the foundation for complex interactive components to ensure accessibility out-of-the-box.
- **Forms & Validation**: All user inputs must be validated on the client side using React Hook Form deeply integrated with Zod schemas.
