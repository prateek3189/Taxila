# Deferred Work

Items surfaced during review but not caused by the current story. Collect here for future focused attention.

---

## From Story 1.1 Review (2026-04-03)

### Jest / Test Infrastructure Not Configured
- `apps/api/package.json` has `"test": "jest"` but `jest`, `ts-jest`, `@types/jest` are not installed
- `apps/web/package.json` has `"test": "vitest run"` but no vitest config file
- `apps/mobile/package.json` has `"test": "jest"` but no jest config  
- **Action**: Add test framework deps and config files in Story 1.1 follow-up or Story 1.3

### ESLint Not Configured
- `apps/api` and `apps/web` have lint scripts calling `eslint` but no eslint deps or config exist
- **Action**: Add root-level eslint + @typescript-eslint config in a dedicated linting setup task

### Turbo Cache Inputs Not Configured
- `turbo.json` tasks lack `"inputs"` declarations; Turbo cannot determine precise cache invalidation
- **Action**: Add `inputs` to each task when implementing features (natural point of discovery)

### Mobile Build Output Path
- `turbo.json` build task declares `"outputs": ["dist/**"]` but `expo export` writes to `dist/` (Expo's default); may cause cache mismatches in CI
- **Action**: Validate and align when setting up EAS Build / CI pipeline (Story 1.4)

### Placeholder Assets
- `apps/mobile/assets/*.png` are 1x1 white pixels — functional but not production-ready
- **Action**: Replace with real brand assets before any user-facing build
