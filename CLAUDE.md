# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript, React 19, and Tailwind CSS v4. The project uses the Next.js App Router architecture with Turbopack for fast development builds. **Bun is the package manager for this project.**

## Development Commands

### Running the Development Server

```bash
bun dev
```

Uses Turbopack for faster development builds. The application runs on http://localhost:3000 by default.

### Building for Production

```bash
bun run build
```

Creates an optimized production build using Turbopack.

### Starting Production Server

```bash
bun start
```

Runs the production build locally.

### Linting

```bash
bun run lint
```

Uses ESLint with Next.js TypeScript configuration (next/core-web-vitals and next/typescript).

### Installing Dependencies

```bash
bun install
```

### Adding shadcn/ui Components

```bash
bunx shadcn@latest add <component-name>
```

Example: `bunx shadcn@latest add button form table`

## Architecture

### Framework & Routing

- **Next.js 15** with App Router (app directory structure)
- File-based routing in `app/` directory
- Server Components by default (use "use client" directive for client components)

### Styling

- **Tailwind CSS v4** with PostCSS integration
- Global styles in `app/globals.css`
- Custom CSS variables for theming:
  - `--background` and `--foreground` for color scheme
  - `--font-geist-sans` and `--font-geist-mono` for typography
- Dark mode support via `prefers-color-scheme` media query
- Tailwind theme customization via `@theme inline` directive

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to project root
- Module resolution: bundler
- Target: ES2017

### Font Loading

- Uses `next/font/google` for optimized font loading
- Geist and Geist Mono fonts loaded via CSS variables
- Font variables applied to body element in root layout

### Project Structure

```
app/
  ├── layout.tsx      # Root layout with fonts and metadata
  ├── page.tsx        # Home page component
  └── globals.css     # Global styles and Tailwind imports
public/               # Static assets (SVG icons, etc.)
```

### Layout System

- Root layout (`app/layout.tsx`) defines:
  - Document structure (html, body)
  - Font loading and CSS variable injection
  - Global metadata (title, description)
- Nested layouts can be created in subdirectories

### Image Optimization

- Use `next/image` component for all images
- Static assets in `public/` directory
- Supports automatic optimization and responsive images

## Key Technologies

- **Package Manager**: Bun
- **React**: 19.1.0 (latest)
- **Next.js**: 15.5.4
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x (with @tailwindcss/postcss plugin)
- **Build Tool**: Turbopack (via --turbopack flag)

## UI Components & Design System

### shadcn/ui Guidelines

This project uses **shadcn/ui** for building UI components. Follow these practices:

#### Component Architecture

- Components live in `components/ui/` directory
- Components are copied into the project (not npm packages) for full customization
- Each component is built with Tailwind CSS and Radix UI primitives
- TypeScript types are included with each component

#### Adding Components

```bash
bunx shadcn@latest add <component-name>
```

Common components:

- **Primitives**: `button`, `input`, `label`, `select`, `checkbox`, `radio-group`
- **Forms**: `form` (with react-hook-form + zod validation)
- **Data Display**: `table`, `card`, `badge`, `avatar`, `separator`
- **Overlays**: `dialog`, `sheet`, `popover`, `dropdown-menu`, `tooltip`
- **Feedback**: `toast`, `alert`, `alert-dialog`

#### Form Handling

Use the shadcn/ui form pattern with **react-hook-form** and **zod**:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

#### Table & Data Display

Use shadcn/ui `table` component with **TanStack Table** for advanced features:

```bash
bunx shadcn@latest add table
```

For data tables with sorting, filtering, and pagination:

```bash
bunx shadcn@latest add data-table
```

#### Styling Conventions

- Use Tailwind utility classes for component styling
- Leverage CSS variables for theming (defined in `globals.css`)
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Follow shadcn/ui's responsive design patterns

#### Accessibility

- All shadcn/ui components are built on Radix UI primitives with accessibility baked in
- Includes proper ARIA attributes, keyboard navigation, and focus management
- Always test with keyboard navigation and screen readers

## ESLint Configuration

The project uses flat config format (`eslint.config.mjs`) with:

- `next/core-web-vitals` preset
- `next/typescript` preset
- Ignores: node_modules, .next, out, build, next-env.d.ts
