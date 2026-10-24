# Animation standards

This document is the source of truth for animation work in **OT UNDER ATTACK**. Any human or AI contributor changing motion should follow these rules before adding a new animation.

## Goals

- Make state changes understandable, not merely decorative.
- Preserve the industrial control-room identity: calm telemetry, deliberate transitions, and restrained alerts.
- Keep the experience usable on a classroom projector and on mid-range hardware.
- Respect `prefers-reduced-motion` and never make motion necessary to understand a decision.

## Animation layers

Use the layer that matches the job:

| Layer           | Location                                           | Use it for                                                               |
| --------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| Framer Motion   | `src/animations/motionTokens.ts` and React screens | Page transitions, briefings, event entry and component state transitions |
| CSS transitions | Component styles in `src/styles/visuals.css`       | Hover, focus, active and short visual feedback                           |
| CSS keyframes   | `src/styles/motion.css`                            | Continuous telemetry loops and ambient plant motion                      |
| Web Audio       | `src/hooks/useSound.ts`                            | Optional feedback sound only; never required for meaning                 |

Do not create ad-hoc animation values in a component when a token or preset already exists.

## Canonical tokens

Framer Motion values live in [`src/animations/motionTokens.ts`](../src/animations/motionTokens.ts):

- `fast`: 180 ms — event entry and micro feedback.
- `base`: 240 ms — cards and local state transitions.
- `slow`: 420 ms — screen-level transitions.
- `standard`: decelerating ease for normal UI motion.
- `emphasis`: stronger entrance ease for screen changes.

CSS loop durations live in [`src/styles/motion.css`](../src/styles/motion.css):

- `--motion-loop-flow`: network conduit movement.
- `--motion-loop-liquid`: process liquid movement.
- `--motion-loop-liquid-highlight`: slower liquid surface highlight movement.
- `--motion-loop-pump`: pump status pulse.
- `--motion-loop-sensor`: level sensor telemetry pulse.
- `--motion-loop-critical`: critical-state pulse.

If a new duration is needed, add it to the token file first and explain why in the code review. Avoid magic numbers such as `0.37`, `1.73s`, or one-off cubic-bezier values.

## Naming conventions

CSS keyframes use the `ot-` namespace and describe the visual subject plus motion:

```css
@keyframes ot-data-flow { ... }
@keyframes ot-pump-pulse { ... }
```

Use these names for new keyframes:

```text
ot-{subject}-{motion}
```

Examples: `ot-sensor-blink`, `ot-valve-open`, `ot-alert-pulse`.

Framer Motion presets use a descriptive subject-independent name: `pageMotion`, `briefingMotion`, `eventMotion`. Add a reusable preset to `motionTokens.ts` instead of repeating `initial`, `animate`, `exit`, and `transition` objects across screens.

## State and semantics

Motion must communicate a state transition:

- Normal telemetry: low-amplitude, continuous motion.
- Warning: color and a restrained pulse; avoid aggressive flashing.
- Incident: highlight the affected connection or node.
- Critical: use the existing critical pulse sparingly and never imply real physical harm.
- Recovery: settle back toward the normal state instead of snapping instantly.

Never use animation as the only indication of state. Pair it with text, color, iconography, or an event-log entry.

Do not use infinite animations for ordinary buttons, reading text, or large layout elements. Infinite loops are reserved for the plant telemetry and critical-state treatment.

## Accessibility and performance

- `MotionConfig reducedMotion="user"` is configured at the application root.
- `src/styles/motion.css` disables or minimizes CSS motion under `prefers-reduced-motion: reduce`.
- Avoid `width`, `height`, `top`, `left`, and layout-affecting properties in animated elements. Prefer `opacity`, `transform`, and SVG stroke properties.
- Keep animation work local to the affected component. Do not animate the whole page when one node changes.
- Do not introduce rapid flashing. Critical states must remain readable and projector-safe.
- Clean up timers, observers, and audio contexts if a new effect creates them.

## Review checklist for humans and AI

Before submitting an animation change, verify:

1. Does the motion explain a state or interaction?
2. Is the correct layer being used?
3. Is there an existing token or preset to reuse?
4. Is the animation named with the `ot-` convention if it is a CSS keyframe?
5. Does reduced motion preserve comprehension?
6. Does the animation avoid layout shifts and unnecessary re-renders?
7. Does it look readable at projector scale and on mobile?
8. Are build, tests, lint, and format checks passing?

## Adding a new animation

1. Add or reuse a token in `motionTokens.ts` or `motion.css`.
2. Add the smallest possible animation to the owning component.
3. Pair the motion with a semantic state class or accessible text.
4. Add a reduced-motion behavior if the existing global rule is not sufficient.
5. Verify normal, warning, incident, recovery, and critical paths when relevant.
6. Update this document if the new behavior creates a new convention or animation layer.
