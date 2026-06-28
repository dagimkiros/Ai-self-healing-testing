# AI Self-Healing Test Suite

A Cypress automation framework that uses Claude AI to automatically repair broken CSS selectors at runtime — tested against GitHub.com.

---

## Overview

Selector rot is the leading cause of test maintenance overhead in frontend projects. When a developer renames a class or removes a data-testid, tests fail not because the feature is broken, but because the locator is stale. This framework solves that by integrating Claude AI directly into the Cypress test lifecycle. When a selector fails, the suite captures the live DOM, sends it to Claude with a plain-English description of the target element, and retries the test with the AI-suggested selector — all without human intervention.

---

## How It Works

1. A test calls `cy.getHealing(selector, hint)` instead of `cy.get(selector)`
2. If the selector finds the element, the test proceeds normally with zero API calls
3. If the selector fails, the full page HTML is captured and sent to Claude along with the broken selector and a hint describing what the element should be
4. Claude analyzes the DOM and returns a new selector with reasoning and a confidence level
5. The test retries with the healed selector and passes
6. Every heal is written to `cypress/logs/heals.json` as an audit trail

---

## Tech Stack

- Cypress 15 — test runner and browser automation
- Claude Sonnet 4.6 — DOM analysis and selector generation
- @anthropic-ai/sdk — Anthropic Node.js client
- Node.js 20 — plugin runtime for API calls and file I/O

---

## Project Structure

cypress/

├── e2e/

│   ├── healing-demo.cy.js       # Four intentionally broken selectors healed live

│   └── github.cy.js             # Full GitHub test suite

├── plugins/

│   └── healing-plugin.js        # Claude API integration and heal logging

├── support/

│   ├── commands.js              # cy.getHealing() custom command

│   └── e2e.js                   # Global setup

└── logs/

└── heals.json               # Audit trail generated after each run
---

## Getting Started

```bash
git clone https://github.com/dagimkiros/ai-self-healing-tests
cd ai-self-healing-tests
npm install
npx cypress install
```

Run the demo with your Anthropic API key:

```bash
ANTHROPIC_API_KEY=your_key_here npm run test:demo
```

Run the full GitHub suite:

```bash
ANTHROPIC_API_KEY=your_key_here npm run test:github
```

---

## Sample Terminal Output
Self-healing triggered in: "heals a broken sign-in button selector"

Broken selector: ".totally-wrong-classname-that-doesnt-exist"
HEALED: ".totally-wrong-classname-that-doesnt-exist" -> "a[href='/login'].HeaderMenu-link"

Reason: Anchor tag with href='/login' and class HeaderMenu-link uniquely identifies

the sign-in link in the top navigation header.

Confidence: high
heals a broken sign-in button selector (4678ms)

---

## Author

Dagim Kiros — QA Engineer / SDET

ISTQB CTFL Certified · Cypress · Playwright · Selenium · Claude API

[LinkedIn](https://www.linkedin.com/in/dagm-kiros/) · [GitHub](https://github.com/dagimkiros)

