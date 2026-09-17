# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

No npm scripts are defined in `package.json`. Use `npx` directly:

```bash
# Run all tests
npx playwright test

# Run a single test file
npx playwright test tests/Login.spec.js

# Run a single test by name
npx playwright test --grep "test name"

# Run in headed mode (visible browser)
npx playwright test --headed

# Run with UI mode (interactive)
npx playwright test --ui

# Open last HTML report
npx playwright show-report

# Install browsers
npx playwright install
```

## Architecture

This is a flat Playwright test suite with no Page Object Model. All tests are self-contained `.spec.js` files in `tests/`. There are no fixtures, helpers, or shared utilities — each test drives the browser inline using direct Playwright API calls.

**Test data** is stored in `TestData/testData.json` (user name, email, password) and loaded via `require`/`import` in individual tests.

**Target applications** are external: `automationexercise.com`, `rediffmail.com`, and playwright.dev. There is no local dev server.

**playwright.config.js** runs only Chromium (Firefox/WebKit commented out), with a 30-second test timeout, HTML reporter, and traces collected on first retry. On CI, tests run with `workers: 1` and `retries: 2`.

## CI

GitHub Actions workflow at `.github/workflows/playwright.yml` triggers on push/PR to `main`/`master`. It installs Node LTS, runs `npx playwright install --with-deps`, then `npx playwright test`, and uploads the HTML report as an artifact (30-day retention).

## Known Issues

- `tests/UiBasictest.spec.js` contains `test.only`, which causes all other tests to be skipped when running the full suite. Remove `.only` before running the full suite or pushing to CI.
- `package.json` sets `"type": "commonjs"` but `playwright.config.js` uses ES module `export default` syntax, which can cause a Node parse error. If you see `SyntaxError: Unexpected token 'export'`, either rename the config to `playwright.config.mjs` or remove the `"type": "commonjs"` field.
