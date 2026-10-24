# Instructions for Claude

Before working in this repository, read [AGENTS.md](AGENTS.md) in full. It is the canonical guide for architecture, style, testing, accessibility, and deployment.

## Additional rules

- Follow every convention in `AGENTS.md`.
- Inspect the repository state before editing.
- Preserve existing work and avoid unrelated changes.
- Keep one main React component per file.
- Keep the `plant`, `simulation`, `results`, and `welcome` features separate.
- Keep educational scenario content separate from scenario rules.
- Update both Spanish and English whenever adding i18next keys.
- Do not introduce hardcoded user-facing text.
- Do not introduce end-to-end tests unless explicitly requested.
- Run formatting, lint, tests, build, and `git diff --check` before reporting completion.
- Do not create commits or push changes unless explicitly requested.

When a task requires an architectural decision, briefly explain the decision and its impact before handing off the change.
