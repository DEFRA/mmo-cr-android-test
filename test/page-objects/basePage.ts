import { logError, logInfo, logStep, logWarn } from '../common/logger';

export class BasePage {
    protected readonly appId = process.env.ANDROID_APP_ID ?? 'mmo.catchrecording.android';
    protected readonly appName = process.env.ANDROID_APP_NAME ?? 'Catch Records';

    get offlineBanner() {
        return $(
            '//android.widget.TextView[contains(@text, "saved and sent when you\'re back online")]',
        );
    }

    get saveAndContinueButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Save and continue"]]',
        );
    }

    async saveAndContinue() {
        logStep('Clicking Save and Continue');
        try {
            await this.saveAndContinueButton.waitForDisplayed({ timeout: 1000 });
        } catch {
            logWarn('BasePage: Save and Continue button not visible, scrolling forward to find it');
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollForward()');
            await this.saveAndContinueButton.waitForDisplayed({ timeout: 1000 });
        }
        await this.saveAndContinueButton.click();
    }

    async isOfflineBannerDisplayed(): Promise<boolean> {
        logStep('Checking if offline banner is displayed');
        return this.offlineBanner.isDisplayed();
    }

    // Swipes the page up until the element is displayed. Pass swipeX to swipe outside gesture-capturing content such as maps.
    async scrollUntilDisplayed(
        element: ChainablePromiseElement,
        { maxSwipes = 5, swipeX }: { maxSwipes?: number; swipeX?: number } = {},
    ) {
        const { width, height } = await driver.getWindowSize();
        const x = swipeX ?? Math.floor(width / 2);
        for (let attempt = 0; attempt < maxSwipes && !(await element.isDisplayed()); attempt++) {
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'page-scroll',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x, y: Math.floor(height * 0.7) },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pointerMove', duration: 400, x, y: Math.floor(height * 0.4) },
                        { type: 'pointerUp', button: 0 },
                    ],
                },
            ]);
            await browser.pause(300);
        }
    }

    async openApp(maxAttempts = 3) {
        let lastError: unknown;

        logStep(`Opening app ${this.appName}`);
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                await driver.activateApp(this.appId);
                // 4 = running in foreground
                await driver.waitUntil(async () => (await driver.queryAppState(this.appId)) === 4, {
                    timeout: 20000,
                    timeoutMsg: 'App did not reach the foreground.',
                });
                logInfo(`BasePage: Successfully opened app on attempt ${attempt}`);
                return;
            } catch (error) {
                lastError = error;
                logWarn(
                    `BasePage: Failed to open app on attempt ${attempt}. Error: ${String(error)}`,
                );
                if (attempt < maxAttempts) {
                    await browser.pause(attempt * 2000);
                }
            }
        }

        logError(`BasePage: Failed to activate app ${this.appId} after ${maxAttempts} attempts`);
        throw lastError;
    }

    async close() {
        logStep(`Terminating app ${this.appId}`);
        await driver.terminateApp(this.appId);
    }
}
