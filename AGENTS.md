# Agentic Coding Guidelines for "nico" Repository

Welcome to the `nico` project. This document serves as the primary system prompt and guideline for AI coding agents operating within this repository. Adherence to these rules ensures code quality, maintainability, and architectural consistency.

---

## 1. Project Overview & Tech Stack

This project is a modern, lightweight React application. 
- **Core Framework**: React 19.2 (using the new JSX transform)
- **Build Tool**: Vite (Lightning fast HMR and optimized production builds)
- **Language**: TypeScript (Strict typing enforced)
- **Styling**: Vanilla CSS with localized stylesheets (`App.css`, `index.css`)
- **Key Libraries**: 
  - `framer-motion` (for complex, performant animations and transitions)
  - `react-swipeable` (for robust touch gesture handling)

Agents should prioritize these native tools and avoid installing additional heavy dependencies unless explicitly authorized by the user.

---

## 2. Build, Lint, and Test Commands

Before completing any task, agents must verify that their changes do not break the build or introduce linting errors. 

### 2.1. Build & Development Server
- **Start Development Server**: `npm run dev`
  - Use this command to test UI changes interactively if you have web preview capabilities.
- **Build for Production**: `npm run build`
  - **CRITICAL**: Always run this after making substantial TypeScript changes. It runs `tsc -b` to verify types before Vite bundles the app.
- **Preview Production Build**: `npm run preview`

### 2.2. Linting
- **Run ESLint**: `npm run lint`
- **Config Details**: The project uses an ESLint Flat Config (`eslint.config.js`). It enforces rules from:
  - `@eslint/js` (Recommended)
  - `typescript-eslint` (Recommended)
  - `eslint-plugin-react-hooks` (Recommended)
  - `eslint-plugin-react-refresh` (Vite specifics)
- **Rule Resolution**: Never disable eslint rules inline (`// eslint-disable-next-line`) without a compelling, documented reason. Fix the underlying type or logic issue instead.

### 2.3. Testing Strategy
- **Current Status**: There is currently no active testing framework (e.g., Vitest, Jest) configured in `package.json`.
- **Adding Tests**: If asked to write tests, prefer installing `vitest` and `@testing-library/react` due to the Vite ecosystem.
- **Running Tests (Future)**: 
  - Run all tests: `npm run test`
  - Run tests in watch mode: `npm run test:watch`
- **Running a Single Test**: Once a test runner is present, use `npm run test -- <path-to-test-file>` or the specific Vitest command `npx vitest run <filename>` to execute isolated tests rapidly.

---

## 3. Code Style & Architecture Guidelines

### 3.1. General Formatting
- **Indentation**: Use 2 spaces for indentation. Never use tabs.
- **Quotes**: Use single quotes (`'`) for JavaScript/TypeScript strings. Use double quotes (`"`) strictly for JSX/HTML attributes.
- **Semicolons**: Use semicolons at the end of statements consistently. 
- **Line Length**: Keep lines under 100 characters where possible to improve readability. Break down long prop lists in JSX onto multiple lines.

### 3.2. TypeScript & Typing
- **Strictness**: Enforce strict TypeScript types. Avoid the use of `any` at all costs. If the type is truly unknown, use `unknown` and perform type narrowing.
- **Definitions**: Prefer `interface` over `type` for object definitions and component props. Interfaces are more extensible and generally result in better error messages.
- **Props**: Define clear, descriptive interfaces for component props. Example:
  ```typescript
  interface ImageCarouselProps {
    items: GalleryItem[];
    onIndexChange: (index: number) => void;
  }
  ```
- **Hooks**: Strongly type hooks when initial state inference is insufficient. 
  - *Good*: `const [items, setItems] = useState<GalleryItem[]>([]);`
  - *Bad*: `const [items, setItems] = useState([]);`

### 3.3. Imports
Maintain a clean and predictable import order. Organize imports into grouped blocks separated by a single blank line:
1. Built-in React hooks and types (`import { useState, useEffect } from 'react';`)
2. Third-party library imports (`import { motion } from 'framer-motion';`)
3. Absolute project imports (if configured in the future via `tsconfig.json` paths)
4. Relative component and hook imports (`import { useGallery } from './hooks/useGallery';`)
5. Stylesheets and static assets (`import './App.css';`)
- *Note*: Do not import the default `React` object unless necessary for APIs like `React.cloneElement`. React 19 uses the new JSX transform.

### 3.4. Naming Conventions
- **Files**: 
  - React components: `PascalCase.tsx` (e.g., `GalleryViewer.tsx`)
  - Utility functions and custom hooks: `camelCase.ts` (e.g., `useAudioPlayer.ts`)
- **Variables/Functions**: Use descriptive `camelCase`. Function names should be verbs (e.g., `fetchData`, `handleNextItem`).
- **Constants**: Use `UPPER_SNAKE_CASE` for global, non-mutating constants (e.g., `MAX_RETRY_COUNT`).
- **CSS Classes**: Use `kebab-case` for class names (e.g., `nav-arrow`, `gallery-container`).

### 3.5. React Patterns & Hooks
- **Functional Components**: Use functional components exclusively.
- **State Management**: Keep state as local as possible. Lift state up only when necessary to share it between sibling components.
- **`useEffect`**: 
  - Keep dependency arrays exhaustive and accurate.
  - Always clean up event listeners, timers, or observable subscriptions in the return function.
- **`useRef`**: Safely check for `ref.current` before manipulating DOM elements. Do not over-rely on refs for data that should trigger re-renders.

### 3.6. Error Handling
- **Async Operations**: Always handle potential rejections. Wrap `await` calls in `try/catch` blocks.
- **Media APIs**: When interacting with the DOM Media API (e.g., `audioRef.current.play()`), always attach a `.catch()` block. Browsers frequently block automated media playback, and uncaught promise rejections will crash or degrade the app.
- **Graceful Fallbacks**: Ensure the UI does not crash if data is missing. Use early returns (e.g., `if (!data) return <LoadingSpinner />;`).

### 3.7. Performance Best Practices
- **Animations**: Leverage `framer-motion` for complex animations rather than CSS transitions where orchestrations are needed. Use the `AnimatePresence` component for exit animations.
- **Rendering**: Avoid defining complex object literals or functions inline within JSX props, as this causes unnecessary re-renders in child components. Memoize callbacks with `useCallback` if passing them to deeply nested components.

---

## 4. Agent Operational Rules
- **No Unsolicited Refactors**: Focus strictly on the user's prompt. Do not refactor unrelated files just because you notice stylistic inconsistencies.
- **Use Context-Aware Editing**: Do not blindly rewrite entire files when only a few lines need to change. Use the `edit` tool accurately.
- **Verify Assumptions**: Always use `read` and `glob` to verify the existence and structure of files before acting. Never assume a file exists based on standard conventions.
- **Verify Before Completion**: Before telling the user a task is complete, run the build command (`npm run build`) in the background to ensure no syntax or type errors were introduced.
