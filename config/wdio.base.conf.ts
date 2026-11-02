import { execFile } from 'node:child_process';
import { rmSync } from 'node:fs';
import { promisify } from 'node:util';
import { logInfo } from '../test/common/logger';

const execFileAsync = promisify(execFile);
const oneMinute = 60 * 1000;

export const appiumPort = Number(process.env.APPIUM_PORT ?? 4723);

export function cleanReports(): void {
    for (const dir of ['allure-results', 'allure-report']) {
        rmSync(dir, { recursive: true, force: true });
    }
}

export async function uninstallAndroidApp(appId: string, udid?: string): Promise<void> {
    const args = [...(udid ? ['-s', udid] : []), 'uninstall', appId];
    try {
        await execFileAsync('adb', args);
        await logInfo(`Uninstalled ${appId}`);
    } catch {
        await logInfo(`${appId} was not installed or could not be uninstalled`);
    }
}

export const baseConfig: Omit<WebdriverIO.Config, 'capabilities'> = {
    hostname: '127.0.0.1',
    port: appiumPort,
    path: '/',

    exclude: [],
    maxInstances: 1,

    logLevel: 'info',
    waitforTimeout: 10000,
    waitforInterval: 200,
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
