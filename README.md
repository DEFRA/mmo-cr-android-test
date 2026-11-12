mmo-cr-android-test

WebdriverIO + Appium + Cucumber test automation (TypeScript) for the Record Your Catch Android app.

- [Local Development](#local-development)
    - [Requirements](#requirements)
        - [Node.js](#nodejs)
    - [Setup](#setup)
    - [Project structure](#project-structure)
    - [Running local tests](#running-local-tests)
    - [Tags](#tags)
    - [Environment variables](#environment-variables)
    - [Writing tests](#writing-tests)
    - [Checks](#checks)
    - [Reports](#reports)
- [Production](#production)
- [BrowserStack](#browserstack)
- [Licence](#licence)
    - [About the licence](#about-the-licence)

## Local Development

### Requirements

#### Node.js

Please install [Node.js](http://nodejs.org/) `>= v20.19` and [npm](https://nodejs.org/) `>= v9`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
nvm use
```

### Setup

Install application dependencies:

```bash
npm install
```

You can put environment variables in `.env`, or set `ENV_FILE` to load a different file.

### Project structure

```
config/                 WebdriverIO configs (base, local Android, BrowserStack)
test/features/          Gherkin feature files (*.feature)
test/step-definitions/  Cucumber step definitions (*.steps.ts)
test/support/           hooks.ts and pages.ts (page-name registry used by "I should be on the ... page")
test/page-objects/      Page objects, one per app screen
test/helpers/           Journey navigator, network and credential helpers
test/common/            Logger and date utilities
```

`hooks.ts` opens the app before and closes it after every scenario, and restores the network after `@offline` scenarios.

### Running local tests

Requires [Appium](https://appium.io/) with the `uiautomator2` driver, and a running Android emulator or connected device.

Place the APK directly in `app/` and set `ANDROID_TEST_EMAIL` and `ANDROID_TEST_PASSWORD`.

```bash
# All features
npm run test:android

# A single feature
npm run test:android:feature -- test/features/signIn.feature

# A single scenario (line number of the Scenario: line)
npm run test:android:feature -- test/features/signIn.feature:4
```

To run every feature sequentially with a fresh app installation for each feature file:

```bash
APPIUM_FULL_RESET=true APPIUM_NO_RESET=false npm run test:android
```

Full reset uninstalls the app and clears its data between feature files, not between individual scenarios.
`APPIUM_FULL_RESET` and `APPIUM_NO_RESET` cannot both be `true`.

### Tags

Filter scenarios with a [Cucumber tag expression](https://cucumber.io/docs/cucumber/api/#tag-expressions) in `CUCUMBER_TAGS`:

```bash
CUCUMBER_TAGS='@reviewAndAmend' npm run test:android
CUCUMBER_TAGS='@catchRecord and not @offline' npm run test:android
```

| Tag                                                                | Meaning                                              |
| ------------------------------------------------------------------ | ---------------------------------------------------- |
| `@signIn`                                                          | Sign-in screen                                       |
| `@catchRecord`                                                     | All catch record features                            |
| `@businessRules`, `@drafts`, `@reviewAndAmend`, `@selectedSpecies` | Individual catch record features                     |
| `@offline`                                                         | Runs offline; network is restored after the scenario |
| `@skip`                                                            | Not implemented yet; never run                       |

### Environment variables

| Variable                                                          | Purpose                                |
| ----------------------------------------------------------------- | -------------------------------------- |
| `ANDROID_TEST_EMAIL`, `ANDROID_TEST_PASSWORD`                     | Account used by `Given I am signed in` |
| `ANDROID_DEVICE_NAME`, `ANDROID_PLATFORM_VERSION`, `ANDROID_UDID` | Optional device selection              |
| `ANDROID_APP_ID`                                                  | Uninstalls this app before the run     |
| `APPIUM_PORT`                                                     | Appium port (default `4723`)           |
| `APPIUM_NO_RESET`, `APPIUM_FULL_RESET`                            | Appium reset behaviour                 |
| `CUCUMBER_TAGS`                                                   | Tag expression to filter scenarios     |

### Writing tests

1. Add or update a `.feature` file in `test/features/` with a feature-level tag.
2. Reuse existing steps where possible (search `test/step-definitions/`); shared steps live in `common.steps.ts`.
3. New steps must call page objects rather than use raw selectors.

The **BDD → Test Case** Copilot agent (`.github/agents/`) can generate features and step definitions from plain-text scenarios.

For step navigation and "undefined step" warnings in VS Code, point the Cucumber extension at this project's folders in `.vscode/settings.json`:

```json
{
    "cucumber.features": ["test/features/**/*.feature"],
    "cucumber.glue": ["test/step-definitions/**/*.ts", "test/support/**/*.ts"]
}
```

### Checks

```bash
npm run typecheck
npm run format:check

# Verify every Gherkin step matches exactly one step definition (no device needed)
NODE_OPTIONS="--import tsx" npx cucumber-js --dry-run --import 'test/support/**/*.ts' --import 'test/step-definitions/**/*.ts' test/features
```

### Reports

Results are written to `allure-results/`, with a screenshot attached for any failed step.

```bash
npm run report            # generate allure-report/
npm run generate:report   # generate and open in a browser
```

## Production

### Running the tests

Tests are run from the CDP-Portal under the Test Suites section. Before any changes can be run, a new docker image must be built, this will happen automatically when a pull request is merged into the `main` branch.
You can check the progress of the build under the actions section of this repository. Builds typically take around 1-2 minutes.

The results of the test run are made available in the portal.

## Requirements of CDP Environment Tests

1. Your service builds as a docker container using the `.github/workflows/publish.yml`
   The workflow tags the docker images allowing the CDP Portal to identify how the container should be run on the platform.
   It also ensures its published to the correct docker repository.

2. The Dockerfile's entrypoint script should return exit code of 0 if the test suite passes or 1/>0 if it fails

3. Test reports should be published to S3 using the script in `./bin/publish-tests.sh`

## BrowserStack

[config/wdio.android.browserstack.conf.ts](config/wdio.android.browserstack.conf.ts) runs the tests on real Android devices in BrowserStack App Automate.
Set `BROWSERSTACK_USERNAME`, `BROWSERSTACK_KEY` and `BROWSERSTACK_APP_ID` (the `bs://...` URL returned when the APK is uploaded).

```bash
npm run test:android:browserstack
npm run test:android:browserstack:feature -- test/features/signIn.feature
CUCUMBER_TAGS='@signIn' npm run test:android:browserstack
```

It shares the settings in [config/wdio.base.conf.ts](config/wdio.base.conf.ts) with the local config, but uses a 1-minute step timeout (5 minutes locally).

`npm test` runs the same config through the CDP proxy and is used by the CDP Portal. If any scenario fails, a `FAILED` file is written so `entrypoint.sh` exits with a non-zero code.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
