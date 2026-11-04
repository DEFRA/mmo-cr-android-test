import fs from 'node:fs';
import { baseConfig, cucumberOptions, oneMinute } from './wdio.base.conf';

/**
 * On the CDP Portal the proxy is enabled using NODE_USE_ENV_PROXY=1 (see `npm test`).
 * This is required for the test suite to be able to talk to BrowserStack.
 */

const projectName = 'mmo-cr-android-test';
const buildName = `${projectName}-${process.env.ENVIRONMENT ?? 'local'}`;
const proxy = process.env.HTTP_PROXY ? new URL(process.env.HTTP_PROXY) : undefined;

// Not read by WebdriverIO or the BrowserStack service, so it is merged into each device below.
const commonCapabilities = {
    'bstack:options': {
        buildName,
        projectName,
        networkLogs: false,
        consoleLogs: 'info',
        debug: true,
        idleTimeout: 100,
        seleniumLogs: true,
    },
} satisfies WebdriverIO.Capabilities;

const androidDevices = [
    { deviceName: 'Samsung Galaxy S23 Ultra', platformVersion: '13.0' },
    { deviceName: 'Google Pixel 7 Pro', platformVersion: '13.0' },
    { deviceName: 'OnePlus 9', platformVersion: '11.0' },
];

export const config: WebdriverIO.Config & {
    commonCapabilities: WebdriverIO.Capabilities;
} = {
    ...baseConfig,

    // You will need to provide your own BrowserStack credentials.
    // These should be added as secrets to the test suite.
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_KEY,

    commonCapabilities,

    capabilities: androidDevices.map((device) => ({
        'bstack:options': {
            ...commonCapabilities['bstack:options'],
            ...device,
            platformName: 'android',
        },
    })),

    services: [
        [
            'browserstack',
            {
                buildIdentifier: '#${BUILD_NUMBER}',
                // BrowserStack app URL (bs://...) returned when the APK is uploaded.
                app: process.env.BROWSERSTACK_APP_ID,
                browserstackLocal: true,
                opts: {
                    forceLocal: true,
                    localIdentifier: 'test',
                    ...(proxy ? { proxyHost: proxy.hostname, proxyPort: proxy.port } : {}),
                },
                forcedStop: false,
                sessionNamePrependTopLevelSuiteTitle: false,
                sessionNameOmitTestTitle: false,
                skipSessionStatus: false,
                preferScenarioName: false,
                skipSessionName: false,
                sessionNameFormat: (_config, _capabilities, suiteTitle) => suiteTitle,
                testObservability: true,
                testObservabilityOptions: {
                    user: process.env.BROWSERSTACK_USERNAME,
                    key: process.env.BROWSERSTACK_KEY,
                    projectName,
                    buildName,
                    buildTag: ['android'],
                },
                accessibility: true,
                accessibilityOptions: {
                    wcagVersion: 'wcag21a',
                    includeIssueType: {
                        bestPractice: true,
                        needsReview: false,
                    },
                },
                percy: false,
                percyCaptureMode: 'auto',
                percyOptions: {},
                turboScale: false,
            },
        ],
    ],

    reporters: [
        [
            // Spec reporter provides rolling output to the logger so you can see it in-progress
            'spec',
            {
                addConsoleLogs: true,
                realtimeReporting: true,
                color: false,
            },
        ],
        [
            // Allure is used to generate the final HTML report
            'allure',
            {
                outputDir: 'allure-results',
                useCucumberStepReporter: true,
            },
        ],
    ],

    cucumberOpts: cucumberOptions(oneMinute),

    onComplete: function (exitCode, config, capabilities, results?: { failed?: number }) {
        // !Do Not Remove! Required for test status to show correctly in portal.
        if (results?.failed && results.failed > 0) {
            fs.writeFileSync('FAILED', JSON.stringify(results));
        }
    },
};
