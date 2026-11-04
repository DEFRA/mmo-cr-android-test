mmo-cr-android-test

WebdriverIO + Appium test automation (TypeScript) for the Record Your Catch Android app.

- [Local](#local)
    - [Requirements](#requirements)
        - [Node.js](#nodejs)
    - [Setup](#setup)
    - [Running local tests](#running-local-tests)
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

### Running local tests

Requires [Appium](https://appium.io/) with the `uiautomator2` driver, and a running Android emulator or connected device.

Place the APK directly in `app/`. Optionally set `ANDROID_DEVICE_NAME` and `ANDROID_PLATFORM_VERSION`.

Tests are written in Gherkin (`test/features/*.feature`) and run with Cucumber. Step definitions live in `test/step-definitions/` and call the page objects in `test/page-objects/`.

```bash
npm run test:android
npm run test:android:spec -- test/features/signIn.feature
CUCUMBER_TAGS='@catchRecord and not @offline' npm run test:android
```

Scenarios tagged `@skip` are never run.

To run every feature sequentially with a fresh app installation for each feature file:

```bash
APPIUM_FULL_RESET=true APPIUM_NO_RESET=false npm run test:android
```

Full reset uninstalls the app and clears its data between feature files, not between individual scenarios.
`APPIUM_FULL_RESET` and `APPIUM_NO_RESET` cannot both be `true`.

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
```

`npm test` runs the same config through the CDP proxy and is used by the CDP Portal.

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
