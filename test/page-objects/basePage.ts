import { logError, logInfo, logStep, logWarn } from '../common/logger';

export class BasePage {
    protected readonly appId = process.env.ANDROID_APP_ID ?? 'mmo.catchrecording.android';

    get languageToggle() {
        return $('//android.widget.TextView[@text="CYM"]');
    }

    get govUkLogo() {
        return $('~GOV.UK');
    }

    get backButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Back"]]',
        );
    }

    get offlineBanner() {
        return $(
            '//android.widget.TextView[contains(@text, "saved and sent when you\'re back online")]',
        );
    }

    get catchRecordReference() {
        return $('//android.widget.ScrollView/android.widget.TextView[@drawing-order="0"]');
    }

    get saveAndContinueButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Save and continue"]]',
        );
    }

    async switchToWelsh() {
        logStep('Switching language to Welsh');
        await this.languageToggle.click();
    }

    async goBack() {
        logStep('Navigating back');
        await this.backButton.click();
    }

    async saveAndContinue() {
        logStep('Clicking Save and Continue');
        try {
            await this.saveAndContinueButton.waitForDisplayed({ timeout: 1000 });
        } catch (error) {
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

    get homeTab() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Home"]]',
        );
    }

    get notificationsTab() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Notifications"]]',
        );
    }

    get settingsTab() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Settings"]]',
        );
    }

    async goToHome() {
        logStep('Going to home tab');
        await this.homeTab.waitForDisplayed();
        await this.homeTab.click();
    }

    async goToNotifications() {
        logStep('Going to notifications tab');
        await this.notificationsTab.waitForDisplayed();
        await this.notificationsTab.click();
    }

    async goToSettings() {
        logStep('Going to settings tab');
        await this.settingsTab.waitForDisplayed();
        await this.settingsTab.click();
    }

    async openApp() {
        let lastError: unknown;

        logStep(`Opening app with ID ${this.appId}`);
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await driver.activateApp(this.appId);
                await driver.waitUntil(async () => (await driver.getPageSource()).length > 0, {
                    timeout: 20000,
                    timeoutMsg: 'App did not finish launching.',
                });
                logInfo(`BasePage: Successfully opened app on attempt ${attempt}`);
                return;
            } catch (error) {
                lastError = error;
                logWarn(`BasePage: Failed to open app on attempt ${attempt}. Error: ${error}`);
                if (attempt < 3) {
                    await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
                }
            }
        }

        logError(`BasePage: Failed to activate app ${this.appId} after 3 attempts`);
        throw lastError ?? new Error(`Failed to activate app ${this.appId}.`);
    }

    async close() {
        logStep(`Terminating app ${this.appId}`);
        await driver.terminateApp(this.appId);
    }

    async navigateTo(tab: string) {
        logStep(`Navigating to tab ${tab}`);
        const tabElement = $(`~${tab}`);
        await tabElement.waitForDisplayed();
        await tabElement.click();
    }

    async switchContext(contextName: string) {
        await driver.switchContext(contextName);
    }

    async getContexts(): Promise<string[]> {
        return (await driver.getContexts()) as string[];
    }

    async switchToWebview() {
        logStep('Switching to WEBVIEW context');
        const contexts = await this.getContexts();
        const webviewContext = contexts.find((context) => context.includes('WEBVIEW'));
        if (!webviewContext) {
            logError('BasePage: Failed to find WEBVIEW context');
            throw new Error('No webview context found');
        }
        await this.switchContext(webviewContext);
    }

    async switchToNativeContext() {
        logStep('Switching to NATIVE_APP context');
        await this.switchContext('NATIVE_APP');
    }

    async acceptAlert() {
        logStep('Accepting alert');
        await driver.acceptAlert();
    }

    async dismissAlert() {
        logStep('Dismissing alert');
        await driver.dismissAlert();
    }

    async getAlertText(): Promise<string> {
        return driver.getAlertText();
    }

    async dismissSavePasswordPrompt(): Promise<void> {
        try {
            await driver.waitUntil(() => driver.isAlertOpen(), {
                timeout: 5000,
                interval: 250,
            });
            const alertText = await this.getAlertText();
            if (/password/i.test(alertText)) {
                await this.dismissAlert();
            }
        } catch {
            logInfo('BasePage: No save-password alert to dismiss');
        }
    }
}
