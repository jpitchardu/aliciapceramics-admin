# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native admin dashboard for Alicia P Ceramics built with Expo. The application manages ceramic commission orders and displays them in a dashboard interface. It uses TypeScript, React 19, Gluestack UI components, NativeWind for styling, and Supabase for backend data management.

## Commands

**Development:**

```bash
npx expo start          # Start development server (supports web, iOS, Android)
npm run android         # Start Android emulator
npm run ios             # Start iOS simulator
npm run web             # Start web development
npm run lint            # Run ESLint
```

**Project Management:**

```bash
npm run reset-project   # Move starter code to app-example and create blank app directory
```

## Architecture

### Directory Structure

- `app/` - Expo Router file-based routing (App Router equivalent for React Native)
- `components/` - Reusable UI components organized by feature
- `hooks/` - Custom React hooks for data fetching and state management
- `api/` - Supabase client configuration and database types
- `components/ui/gluestack-ui-provider/config.ts` - Gluestack UI theme configuration with brand colors

### Key Patterns

**UI Framework:**

- Uses Gluestack UI as the component library with custom theme configuration
- NativeWind provides Tailwind CSS styling for React Native
- Semantic color system defined in `components/ui/gluestack-ui-provider/config.ts`

**Color System:**

IMPORTANT: Only use semantic color names, never hardcoded values or standard Tailwind colors.

Available semantic colors:
- **Primary (Brown)**: `primary-50` (backgrounds), `primary-100` (form containers), `primary-800` (pressed states), `primary-900` (text, buttons)
- **Interactive (Blue)**: `interactive-300` (info backgrounds), `interactive-400` (selection backgrounds), `interactive-500` (selection borders)
- **Input (Pink)**: `input-300` (option backgrounds), `input-400` (input backgrounds), `input-500` (input borders)
- **Alert (Red)**: `alert-600` (errors, required fields)
- **Neutral (Gray)**: `neutral-50` (white), `neutral-200` (borders), `neutral-600` (disabled text)

Examples:
- `bg-primary-50` instead of `bg-white` or `bg-gray-50`
- `text-primary-900` instead of `text-gray-800` or hardcoded `#3d1900`
- `border-neutral-200` instead of `border-gray-300` or hardcoded `#e8ecee`

**Data Management:**

- Supabase client for backend database operations
- Custom hooks pattern for data fetching (e.g., `useOrders`)
- TypeScript types generated from Supabase database schema

**Navigation & Routing:**

- Expo Router for file-based routing similar to Next.js App Router
- Stack navigation with customizable screen options

### Technology Stack

- **Framework:** Expo SDK 53 with React Native 0.79 and React 19
- **Styling:** Gluestack UI components + NativeWind (Tailwind for React Native)
- **Backend:** Supabase for database and real-time features
- **Development:** TypeScript with strict mode, ESLint for code quality
- **Package Manager:** npm with standard React Native/Expo workflow

### Path Aliases

- `@/*` maps to `./*` for clean imports throughout the project

### Environment Configuration

- Supabase connection requires `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` environment variables
- Cross-platform builds supported for iOS, Android, and web via Expo
