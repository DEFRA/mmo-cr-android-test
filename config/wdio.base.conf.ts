import { execFile } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { logInfo } from '../test/common/logger';

const execFileAsync = promisify(execFile);
export const oneMinute = 60 * 1000;

export const appiumPort = Number(process.env.APPIUM_PORT ?? 4723);

export function cucumberOptions(timeout: number): WebdriverIO.CucumberOpts {
    const tags = ['not @skip', process.env.CUCUMBER_TAGS && `(${process.env.CUCUMBER_TAGS})`]
        .filter(Boolean)
        .join(' and ');

    return {
        require: [join(process.cwd(), 'test/step-definitions/**/*.ts')],
        timeout,
        tags,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        ignoreUndefinedDefinitions: false,
    };
}

async function screenshotOnFailedStep(
    _step: unknown,
    _scenario: unknown,
    result: { passed: boolean },
): Promise<void> {
    if (!result.passed) {
        await driver.takeScreenshot();
    }
}

export function cleanReports(): void {
    for (const dir of ['allure-results', 'allure-report']) {
        rmSync(dir, { recursive: true, force: true });
    }
}

export async function uninstallAndroidApp(appId: string, udid?: string): Promise<void> {
    const args = [...(udid ? ['-s', udid] : []), 'uninstall', appId];
    try {
        await execFileAsync('adb', args);
        logInfo(`Uninstalled ${appId}`);
    } catch {
        logInfo(`${appId} was not installed or could not be uninstalled`);
    }
}

export const allureReporter: NonNullable<WebdriverIO.Config['reporters']>[number] = [
    'allure',
    {
        outputDir: 'allure-results',
        useCucumberStepReporter: true,
        // Raw findElement/isElementDisplayed calls are noise; logStep messages are reported instead.
        disableWebdriverStepsReporting: true,
    },
];

export const baseConfig: Omit<WebdriverIO.Config, 'capabilities'> = {
    runner: 'local',
    specs: ['../test/features/**/*.feature'],
    exclude: [],
    maxInstances: 1,
    bail: 0,

    logLevel: 'info',
    waitforTimeout: 10000,
    waitforInterval: 200,
    connectionRetryTimeout: 2 * oneMinute,
    connectionRetryCount: 3,
    // WebdriverIO 10 defaults this to true; Compose screen transitions briefly keep both screens in the tree,
    // so selectors can transiently match twice. Keep WebdriverIO 9 first-match behaviour.
    strictSelectors: false,

    framework: 'cucumber',

    reporters: ['spec', allureReporter],

    cucumberOpts: cucumberOptions(5 * oneMinute),

    afterStep: screenshotOnFailedStep,
};
