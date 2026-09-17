---
name: jira-to-playwright
description: Use this skill when the user provides a Jira ticket URL and asks to generate a Playwright test from it. Extracts the ticket ID and steps from the Jira issue, derives a module name from the summary, and creates a new test file at tests/TicketID_Module_spec.js.
user-invocable: true
---

# Jira to Playwright Test Generator

Convert a Jira ticket into a Playwright test file automatically.

## Invocation

User provides a Jira URL in their prompt, e.g.:
```
/jira-to-playwright https://hotstar.atlassian.net/browse/RL-14209
```
Or inline: "pick steps from jira https://... and create a test"

## Step-by-step workflow

### 1. Parse the URL

Extract the ticket ID from the URL. The ID is the last path segment, e.g. `RL-14209` from `https://hotstar.atlassian.net/browse/RL-14209`.

Extract the cloud host from the URL (e.g. `hotstar.atlassian.net`) — use it as the `cloudId` for the Atlassian MCP tool.

### 2. Fetch the Jira issue

Use `mcp__claude_ai_Atlassian__getJiraIssue` with:
- `cloudId`: the host extracted above
- `issueIdOrKey`: the ticket ID
- `responseContentFormat`: `"markdown"`
- `fields`: `["summary", "description"]`

### 3. Derive the module name

From the issue **summary**, produce a PascalCase module name:
- Remove filler words: a, an, the, with, for, and, or, of, in, on, to, by, at, from
- Title-case each remaining word and join them (no spaces or dashes)
- Cap at 3 words to keep filenames readable
- Examples:
  - "Login with valid credentials" → `Login`
  - "Playwright POC with AI integration" → `PlaywrightPoc`
  - "Add product to cart" → `AddProductCart`
  - "User registration flow" → `UserRegistration`

If the summary is empty, fall back to `Test`.

### 4. Read existing tests for conventions

Read one existing `.spec.js` file from `tests/` to confirm selector patterns and assertion style used in this project. Do not replicate its content — just match its style.

Key conventions in this project:
- CommonJS: use `require`, never ES module `import`
- Load test data: `const testData = require('../TestData/testData.json');`
- Standard assertion: `await expect(locator).toBeVisible()` or `toHaveTitle()`
- Selector preference: `data-qa` attributes first, then ARIA roles, then text

### 5. Translate description into test steps

The Jira description contains numbered steps. Map each step to a Playwright action:

| Step pattern | Playwright call |
|---|---|
| Launch / navigate to URL | `await page.goto('url')` |
| Enter / fill `<field>` | `await page.locator('[data-qa="field"]').fill(value)` |
| Click `<button/link>` | `await page.getByRole('button', { name: '...' }).click()` |
| Select `<option>` | `await page.selectOption(selector, value)` |
| Verify / assert visible | `await expect(page.locator('...')).toBeVisible()` |
| Verify title | `await expect(page).toHaveTitle('...')` |

For field selectors: use `data-qa` attribute names derived from the field label (e.g. "email" → `[data-qa="login-email"]`). If the step references `testData.json`, map to the correct path (`testData.user.email`, `testData.user.password`, `testData.user.name`).

Always add a meaningful final assertion that confirms success (e.g. logout link visible after login, item in cart after add, account page after registration).

### 6. Write the test file

**Filename**: `tests/{TicketID}_{Module}_spec.js`  
Example: `tests/RL-14209_PlaywrightPoc_spec.js`

**Template**:
```js
const { test, expect } = require('@playwright/test');
const testData = require('../TestData/testData.json');

// {TicketID}: {Jira summary}
test('{descriptive test name}', async ({ page }) => {
    // step 1
    // step 2
    // ...
    // assertion
});
```

Rules:
- One `test()` block per ticket (unless the steps clearly describe multiple independent scenarios)
- Test name should be a readable sentence describing the user action and outcome
- Add the ticket reference as a comment on the line above the `test()` call
- No extra comments explaining obvious Playwright calls
- No `test.only` — use plain `test()`

### 7. Confirm

After writing the file, report:
- The file path created
- The module name derived and why
- The steps translated
- The final assertion chosen and why
