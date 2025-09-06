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
- `theme/` - Gluestack UI theme configuration with brand colors

### Key Patterns

**UI Framework:**
- Uses Gluestack UI as the component library with custom theme configuration
- NativeWind provides Tailwind CSS styling for React Native
- Custom theme in `theme/aliciap-theme.ts` defines brand colors, typography, and spacing

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