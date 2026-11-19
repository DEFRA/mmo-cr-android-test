---
applyTo: '**'
description: 'Route pasted BDD/Gherkin and Android page source XML to the matching custom agent'
---

# Agent routing

Android-only WebdriverIO + Appium + Cucumber (TypeScript) tests for the Record Your Catch app. See `README.md` for setup and conventions.

## Route pasted input to the matching custom agent

Check every user message before doing anything else:

- **BDD / Gherkin** — the message contains `Feature:`, `Scenario:`, `Scenario Outline:`, `Background:` or lines starting with `Given` / `When` / `Then` / `And` / `But`, even with no other text. Treat it as a request to add tests. Delegate to the `BDD → Test Case` custom agent as a subagent, passing the user's full pasted text unchanged plus any extra instructions (for example which feature file or tag to use). If subagents are unavailable, follow `.github/agents/bdd-to-testcase.agent.md` yourself.
- **Android page source XML** — the message (or an attached file) contains a `<hierarchy` element or `android.widget.*` / `android.view.*` nodes, even with no other text. Treat it as a request to update the page object for that screen: fix locators that changed and add missing ones, or create the page object if none exists. Delegate to the `XML → Page Object` custom agent the same way (pass the full XML, or the attached file path), or follow `.github/agents/xml-to-pageobject.agent.md` yourself.

After the agent finishes, summarise the files it created or changed and the result of its checks.

## Checks

- `npm run steps:check` — Cucumber dry run; fails if any feature step has no step definition (`@manual` scenarios excluded).
- `npm run typecheck`, `npm run lint`, `npm run format:check`.
- Running scenarios needs an Android emulator, Appium and `ANDROID_TEST_EMAIL` / `ANDROID_TEST_PASSWORD`: `npm run test:android:feature -- <feature path>`.
