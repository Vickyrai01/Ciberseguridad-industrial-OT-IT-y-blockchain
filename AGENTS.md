# Agent Working Guide

This document defines the mandatory conventions for working in this repository. Every agent must read it before modifying code.

## Project context

OT UNDER ATTACK is an educational industrial cybersecurity OT/IT simulator. It is a static frontend application with no backend, database, authentication, or external services.

The application simulates five decisions, shuffles the scenario order, updates the state of a fictional industrial plant, and displays the final result and decision history.

All simulator values are educational. They do not represent real industrial measurements and do not issue commands to OT systems.

## Stack

- React 18 + strict TypeScript.
- Vite.
- Framer Motion for interface transitions and animations.
- Lucide React for icons.
- Tailwind CSS for layout, responsive behavior, and general utilities.
- Dedicated CSS for SVG visuals, effects, and plant-specific animations.
- i18next + react-i18next for Spanish and English.
- Vitest for unit tests.
- GitHub Pages through GitHub Actions.

## Structure

```text
frontend/
  features/
    plant/
      components/              industrial digital twin and SVG parts
    simulation/
      components/              briefing, progress, feedback, and plant panel
      data/                    educational content and scenario rules
      engine/                  pure state and consequence logic
      hooks/                   React game-state orchestration
    results/
      components/              metrics, classification, and history
      utils/                   derived result calculations
    welcome/                   welcome screen and components
  shared/
    components/                reusable layout and indicator components
    constants/                 states, zones, events, and configuration
    hooks/                     reusable hooks such as sound
    utils/                     event formatting and shared utilities
  i18n/                        configuration, locales, and translation types
  styles/                      Tailwind, visual, console, and motion styles
  types.ts                     shared domain types
  App.tsx                      main screen composition
```

## Architecture rules

### One component per file

Each `.tsx` file must export at most one main React component.

If an auxiliary component has its own responsibility, it must live in its own file.

### Feature-oriented organization

Code specific to a feature must remain inside `frontend/features/<feature>`.

Use `frontend/shared` only for code genuinely reused by two or more features. Do not move code to `shared` merely to shorten imports.

### Separate content from rules

Scenario responsibilities must remain separated:

- `scenarioContent.ts`: text, translation keys, and educational content.
- `scenarioRules.ts`: consequences, states, zones, impacts, and events.
- `scenarios.ts`: typed composition of content and rules.

Do not mix narrative content with engine logic when it can be avoided.

### React-independent engine

The engine in `features/simulation/engine` must remain pure and must not import React, hooks, components, or i18next.

The engine works with structured data. Translation and event presentation belong to the UI/shared layer.

### Game state

Interface transitions are modeled through `useReducer` in `useSimulation`.

Do not add independent setters for game-flow state when the change represents a state transition. Prefer explicit reducer actions.

The history must store stable identifiers (`scenarioId` and `choiceId`) and must never depend on the position of a shuffled array.

## Constants and types

- Do not compare states, zones, outcomes, or event types with string literals.
- Use the constants from `frontend/shared/constants/domain.ts`.
- When adding a domain value, add its derived type as well.
- Avoid `string` when a union or specific type exists.
- Do not use `any`, `@ts-ignore`, or unnecessary casts.
- Events must use the discriminated `EventLogEntry` union.

Example:

```ts
if (state.operationalStatus === OPERATIONAL_STATUS.CRITICAL) {
  // ...
}
```

## Translations

- Every user-facing string must use i18next.
- Every new key must be added to both `frontend/i18n/locales/es.ts` and `frontend/i18n/locales/en.ts`.
- Translation keys are typed; the build must detect incomplete structures.
- Do not hardcode visible text in components, buttons, labels, tooltips, error messages, or logs.
- Technical values that belong to the domain model may remain data, but their presentation must be translated when appropriate.

## Styling

- Use Tailwind for layout, spacing, positioning, responsive behavior, typography, and simple states.
- Keep dedicated CSS for SVG, filters, glow, connections, visual effects, and plant-specific animations.
- Do not duplicate the same rule between Tailwind and global CSS.
- Do not change the visual identity unless the task explicitly requests it.
- Check desktop, tablet, and mobile behavior when changing layout.
- Keep animation tokens in `frontend/animations/motionTokens.ts`.
- Follow `docs/ANIMATIONS.md` for any new or modified animation.

## Accessibility

- Every button must have `type="button"` unless it belongs to an explicit form.
- Icon-only buttons must have an `aria-label` and a tooltip when appropriate.
- Use `aria-pressed` for toggles and selections.
- Use `aria-expanded` for controls that show or hide content.
- Preserve visible focus and keyboard navigation.
- Do not rely only on color or animation to communicate state.
- Logs should preserve `role="log"` and `aria-live` when appropriate.

## Tests and validation

Before delivering changes, run:

```bash
npm run format
npm run format:check
npm run lint
npm run test
npm run build
git diff --check
```

Tests should especially cover:

- engine consequences;
- results and classification;
- shuffled scenarios;
- structured events and formatting;
- new domain rules.

Do not add end-to-end tests unless explicitly requested.

## GitHub Actions and deployment

The workflow is located at `.github/workflows/ci.yml` and is named `CI / Deploy`.

Jobs must keep clear names and this order:

```text
Quality checks -> Build application -> Deploy to GitHub Pages
```

Pull Requests run quality checks and build. `main` also deploys to GitHub Pages.

Do not hardcode the repository name in `VITE_BASE_PATH`.
Keep Node aligned with `.nvmrc` and `package.json`.
Never add secrets to the repository.

## Mandatory workflow

1. Read this file and the relevant documentation.
2. Inspect affected files and their consumers before editing.
3. Review existing changes; do not overwrite someone else's work.
4. Implement the smallest necessary change.
5. Update related types, translations, tests, and documentation.
6. Run the validation commands above.
7. Report changed files, validation results, and any limitations.

Do not run `git reset --hard`, `git checkout --`, or destructive file deletion without an explicit request.

Do not create commits or push changes unless the user explicitly asks for it.
