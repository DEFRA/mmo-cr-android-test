import fs from 'node:fs';
import { allureReporter, baseConfig, cucumberOptions, oneMinute } from './wdio.base.conf';

const projectName = 'mmo-cr-android-test';
const buildName = `${projectName}-${process.env.ENVIRONMENT ?? 'local'}`;
const proxy = process.env.HTTP_PROXY ? new URL(process.env.HTTP_PROXY) : undefined;

const commonCapabilities = {
    'bstack:options': {
        buildName,
        projectName,
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
                app: process.env.BROWSERSTACK_APP_ID,
                browserstackLocal: true,
                opts: {
                    forceLocal: true,
                    localIdentifier: 'test',
                    ...(proxy ? { proxyHost: proxy.hostname, proxyPort: proxy.port } : {}),
                },
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
            },
        ],
    ],

    reporters: [
        [
            'spec',
            {
                addConsoleLogs: true,
                realtimeReporting: true,
                color: false,
            },
        ],
        allureReporter,
    ],

    cucumberOpts: cucumberOptions(oneMinute),

    onComplete: function (exitCode, config, capabilities, results?: { failed?: number }) {
        if (results?.failed && results.failed > 0) {
            fs.writeFileSync('FAILED', JSON.stringify(results));
        }
    },
};
