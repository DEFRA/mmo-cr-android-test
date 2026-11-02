import path from 'node:path';

const oneMinute = 60 * 1000;

export const config: WebdriverIO.Config = {
    runner: 'local',

    // Appium server started by @wdio/appium-service
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',

    specs: ['../test/specs/android/**/*.ts'],
    exclude: [],
    maxInstances: 1,

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator',
            ...(process.env.ANDROID_PLATFORM_VERSION
                ? { 'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION }
                : {}),
            'appium:app':
                process.env.ANDROID_APP_PATH ??
                path.resolve(import.meta.dirname, '../app/android/app.apk'),
            'appium:autoGrantPermissions': true,
            'appium:newCommandTimeout': 240,
        },
    ],

    services: [
        [
            'appium',
            {
                args: { address: '127.0.0.1', port: 4723 },
                logPath: './logs',
            },
        ],
    ],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    waitforInterval: 200,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',

    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
            },
        ],
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 5 * oneMinute,
    },

    afterTest: async function (test, context, { error }) {
        if (error) {
            await driver.takeScreenshot();
        }
    },
};
