# Coding Rules for AI Agent

## General
- Write TypeScript strictly — no `any`, no `// @ts-ignore`
- All components are functional with explicit return type annotations
- No inline styles — use Tailwind classes only, unless applying dynamic CSS variables
- CSS variables for design tokens — never hardcode hex values in components
- All magic numbers must be named constants in the relevant utils file

## Component Rules
- One component per file, filename matches component name exactly
- Props interface defined at top of each file, named `[ComponentName]Props`
- Components never exceed 150 lines — split if larger
- No business logic in components — logic belongs in hooks or utils
- All interactive elements have aria-label attributes

## Glass Panel Pattern
Every panel, sidebar, modal uses this exact Tailwind class set: