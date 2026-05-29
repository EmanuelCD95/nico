# Agentic Coding Guidelines for "nico" Repository

Welcome to the `nico` project. This document serves as the primary system prompt and guideline for AI coding agents operating within this repository. Adherence to these rules ensures code quality, maintainability, accessibility, and architectural consistency.

---

## 1. Project Overview & Tech Stack

This project is a modern, lightweight React multimedia gallery application designed for high performance and smooth touch interactions.
- **Core Framework**: React 19.2 (using the new JSX transform without needing `React` imports)
- **Build Tool**: Vite (Lightning fast HMR and optimized production builds)
- **Language**: TypeScript (Strict typing enforced)
- **Styling**: Vanilla CSS (`App.css`, `index.css`)
- **Key Libraries**:
  - `framer-motion` (for complex, performant animations and transitions)
  - `react-swipeable` (for robust touch gesture handling on mobile)

**Dependency Rule**: Agents should prioritize these native tools and avoid installing additional heavy dependencies (like UI frameworks or global state managers) unless explicitly authorized by the user.

---

## 2. Build, Lint, and Test Commands

Before completing any task, agents must verify that their changes do not break the build or introduce linting errors.

### 2.1. Build & Development Server
- **Start Development Server**: `npm run dev`
  - Use this command to test UI changes interactively if web preview capabilities are available.
- **Build for Production**: `npm run build`
  - **CRITICAL**: Always run this after making substantial TypeScript changes. It runs `tsc -b` to verify types before Vite bundles the app.
- **Preview Production Build**: `npm run preview`

### 2.2. Linting
- **Run ESLint**: `npm run lint`
- **Config Details**: The project uses an ESLint Flat Config (`eslint.config.js`). It enforces rules from `@eslint/js`, `typescript-eslint`, and `eslint-plugin-react-hooks`.
- **Rule Resolution**: Never disable eslint rules inline (`// eslint-disable-next-line`) without a compelling, documented reason. Fix the underlying type or logic issue instead.

### 2.3. Testing Strategy & Commands
- **Current Status**: There is currently no active testing framework configured.
- **Adding Tests**: If asked to write tests, prefer installing `vitest`, `@testing-library/react`, `jsdom`, and `@testing-library/jest-dom`. Update `vite.config.ts` to support tests.
- **Running Tests (Once configured)**:
  - Run all tests: `npm run test`
  - Run tests in watch mode: `npm run test -- --watch`
- **Running a Single Test**: This is critical for isolated debugging.
  - Using npm: `npm run test -- <path-to-test-file>` (e.g., `npm run test -- src/components/Splash.test.tsx`)
  - Using npx: `npx vitest run <filename>`
  - Run specific test by name: `npx vitest run -t "should render splash screen"`

---

## 3. Code Style & Architecture Guidelines

### 3.1. General Formatting
- **Indentation**: Use 2 spaces for indentation. Never use tabs.
- **Quotes**: Use single quotes (`'`) for JavaScript/TypeScript strings. Use double quotes (`"`) strictly for JSX/HTML attributes.
- **Semicolons**: Always use semicolons at the end of statements consistently.
- **Line Length**: Keep lines under 100 characters where possible. Break down long prop lists in JSX onto multiple lines.

### 3.2. TypeScript & Typing
- **Strictness**: Enforce strict TypeScript types. Avoid the use of `any` at all costs. Use `unknown` and perform type narrowing if the type is truly unknown.
- **Definitions**: Prefer `interface` over `type` for object definitions and component props. Interfaces are more extensible and yield better error messages.
  ```typescript
  interface GalleryItemProps {
    item: GalleryItem;
    onInteract: (id: number) => void;
  }
  ```
- **Hooks**: Strongly type hooks when initial state inference is insufficient.
  - *Good*: `const [items, setItems] = useState<GalleryItem[]>([]);`
  - *Bad*: `const [items, setItems] = useState([]);`

### 3.3. Imports
Maintain a clean and predictable import order. Organize imports into grouped blocks separated by a single blank line:
1. Built-in React hooks and types (`import { useState, useEffect } from 'react';`)
2. Third-party library imports (`import { motion, AnimatePresence } from 'framer-motion';`)
3. Absolute project imports (if configured via `tsconfig.json` paths)
4. Relative component and hook imports (`import { useGallery } from './hooks/useGallery';`)
5. Stylesheets and static assets (`import './App.css';`)
*(Note: Do not import the default `React` object unless necessary for APIs like `React.cloneElement`).*

### 3.4. Naming Conventions
- **Files**:
  - React components: `PascalCase.tsx` (e.g., `GalleryViewer.tsx`)
  - Utility functions and custom hooks: `camelCase.ts` (e.g., `useAudioPlayer.ts`)
- **Variables/Functions**: Use descriptive `camelCase`. Function names should be verbs (e.g., `fetchData`, `handleNextItem`).
- **Constants**: Use `UPPER_SNAKE_CASE` for global, non-mutating constants (e.g., `MAX_RETRY_COUNT`).
- **CSS Classes**: Use `kebab-case` for class names to maintain compatibility with vanilla CSS conventions (e.g., `nav-arrow`, `gallery-container`).

### 3.5. Component Architecture & React Patterns
- **Structure**: As the app grows, extract logic from `App.tsx` into standard directories: `src/components/`, `src/hooks/`, `src/utils/`, `src/types/`.
- **Functional Components**: Use functional components exclusively.
- **State Management**: Keep state as local as possible. Lift state up only when necessary to share it between sibling components.
- **`useEffect`**: Keep dependency arrays exhaustive and accurate. Always clean up event listeners, timers, or observable subscriptions in the return function to prevent memory leaks.
- **`useRef`**: Safely check for `ref.current` before manipulating DOM elements. Do not over-rely on refs for data that should trigger re-renders.

### 3.6. Error Handling & Edge Cases
- **Async Operations**: Always handle potential rejections. Wrap `await` calls in `try/catch` blocks.
- **Media APIs**: When interacting with the DOM Media API (e.g., `audioRef.current.play()`), always attach a `.catch()` block. Browsers frequently block automated media playback, and uncaught promise rejections will degrade the app.
- **Graceful Fallbacks**: Ensure the UI does not crash if data or media is missing. Use early returns (e.g., `if (!currentItem) return <LoadingSpinner />;`).

### 3.7. Performance & Accessibility (a11y)
- **Animations**: Leverage `framer-motion` for complex animations rather than CSS transitions where orchestrations are needed. Use `AnimatePresence` for exit animations.
- **Rendering**: Avoid defining complex object literals or functions inline within JSX props, as this causes unnecessary re-renders in child components. Memoize callbacks with `useCallback` if passing them down.
- **Accessibility**: Ensure all interactive elements (`button`, `a`) are focusable and have discernible text or `aria-label`. Use `alt` text for images. Ensure color contrast is sufficient.

---

## 4. Agent Operational Rules

1. **No Unsolicited Refactors**: Focus strictly on the user's prompt. Do not refactor unrelated files just because you notice stylistic inconsistencies.
2. **Use Context-Aware Editing**: Do not blindly rewrite entire files when only a few lines need to change. Use your editing tools accurately.
3. **Verify Assumptions**: Always use your `read` and `glob` tools to verify the existence and structure of files before acting. Never assume a file exists based on standard conventions alone.
4. **Self-Verification**: Before telling the user a task is complete, run the build command (`npm run build`) in the background to ensure no syntax or type errors were introduced by your edits.
5. **Cursor/Copilot Rules**: This `AGENTS.md` file serves as the singular source of truth and supersedes any external `.cursorrules` or `.github/copilot-instructions.md` unless explicitly stated otherwise by the user. No existing Cursor or Copilot rules were found in this repository.