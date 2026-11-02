import { logStep, logWarn } from '../common/logger';

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
        await this.homeTab.waitForDisplayed({ timeout: 10000 });
        await this.homeTab.click();
    }

    async goToNotifications() {
        logStep('Going to notifications tab');
        await this.notificationsTab.waitForDisplayed({ timeout: 10000 });
        await this.notificationsTab.click();
    }

    async goToSettings() {
        logStep('Going to settings tab');
        await this.settingsTab.waitForDisplayed({ timeout: 10000 });
        await this.settingsTab.click();
    }
}
