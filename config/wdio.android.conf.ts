import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { appiumPort, baseConfig, cleanReports, uninstallAndroidApp } from './wdio.base.conf';
import { logInfo } from '../test/common/logger';

const appsDir = join(process.cwd(), 'app');
const apkFile = existsSync(appsDir)
    ? readdirSync(appsDir).find((file) => file.endsWith('.apk'))
    : undefined;
const androidDeviceName = process.env.ANDROID_DEVICE_NAME;
const androidPlatformVersion = process.env.ANDROID_PLATFORM_VERSION;
const androidUdid = process.env.ANDROID_UDID;
const androidAppId = process.env.ANDROID_APP_ID;
const noReset = process.env.APPIUM_NO_RESET === 'true';
const fullReset = process.env.APPIUM_FULL_RESET === 'true';

if (noReset && fullReset) {
    throw new Error('APPIUM_NO_RESET and APPIUM_FULL_RESET cannot both be true.');
}

if (!apkFile) {
    throw new Error('No .apk found in ./app. Place the Record Your Catch APK in the ./app folder.');
}

export const config: WebdriverIO.Config = {
    ...baseConfig,

    hostname: '127.0.0.1',
    port: appiumPort,
    path: '/',

    capabilities: [
        {
            platformName: 'Android',
            'wdio:maxInstances': 1,
            'appium:automationName': 'UiAutomator2',
            ...(androidDeviceName ? { 'appium:deviceName': androidDeviceName } : {}),
            ...(androidPlatformVersion ? { 'appium:platformVersion': androidPlatformVersion } : {}),
            ...(androidUdid ? { 'appium:udid': androidUdid } : {}),
            'appium:app': join(appsDir, apkFile),
            'appium:orientation': 'PORTRAIT',
            'appium:autoGrantPermissions': true,
            'appium:ignoreHiddenApiPolicyError': true,
            'appium:noReset': noReset,
            'appium:fullReset': fullReset,
            'appium:newCommandTimeout': 240,
        },
    ],

    onPrepare: async () => {
        cleanReports();
        logInfo(
            'Android onPrepare: Using apk ' +
                apkFile +
                ', Device: ' +
                (androidDeviceName ?? 'auto'),
        );
        if (androidAppId) {
            await uninstallAndroidApp(androidAppId, androidUdid);
        }
    },

    services: [
        [
            'appium',
            {
                command: 'appium',
                args: {
                    port: appiumPort,
                    relaxedSecurity: true,
                    log: './logs/appium.log',
                },
            },
        ],
    ],
};
