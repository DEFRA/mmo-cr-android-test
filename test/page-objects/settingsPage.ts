import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class SettingsPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Your settings" and @heading="true"]');
    }

    get optionalAnalyticsDataText() {
        return $('//android.widget.TextView[@text="Optional analytics data"]');
    }

    get analyticsDescriptionText() {
        return $(
            '//android.widget.TextView[contains(@text, "We use this to improve the experience")]',
        );
    }

    get analyticsToggle() {
        return $('//android.view.View[@checkable="true"]');
    }

    get howWeUseYourDataButton() {
        return $('//android.widget.Button[@text="How we use your data"]');
    }

    get myAccountButton() {
        return $('//android.widget.Button[@text="My account"]');
    }

    get privacyNoticeButton() {
        return $('//android.widget.Button[@text="Privacy notice"]');
    }

    get supportInformationButton() {
        return $('//android.widget.Button[@text="Support information"]');
    }

    get signOutButton() {
        return $('//android.widget.Button[@text="Sign out"]');
    }

    async toggleAnalytics() {
        logStep('Toggling analytics');
        await this.analyticsToggle.waitForDisplayed({ timeout: 10000 });
        await this.analyticsToggle.click();
    }

    async isAnalyticsEnabled(): Promise<boolean> {
        logStep('Checking if analytics is enabled');
        await this.analyticsToggle.waitForDisplayed({ timeout: 10000 });
        const checked = await this.analyticsToggle.getAttribute('checked');
        return checked === 'true';
    }

    async clickHowWeUseYourData() {
        logStep('Clicking How we use your data');
        await this.howWeUseYourDataButton.waitForDisplayed({ timeout: 10000 });
        await this.howWeUseYourDataButton.click();
    }

    async clickMyAccount() {
        logStep('Clicking My account');
        await this.myAccountButton.waitForDisplayed({ timeout: 10000 });
        await this.myAccountButton.click();
    }

    async clickPrivacyNotice() {
        logStep('Clicking Privacy notice');
        await this.privacyNoticeButton.waitForDisplayed({ timeout: 10000 });
        await this.privacyNoticeButton.click();
    }

    async clickSupportInformation() {
        logStep('Clicking Support information');
        await this.supportInformationButton.waitForDisplayed({ timeout: 10000 });
        await this.supportInformationButton.click();
    }

    async clickSignOut() {
        logStep('Clicking Sign out');
        await this.signOutButton.waitForDisplayed({ timeout: 10000 });
        await this.signOutButton.click();
    }
}

export default new SettingsPage();
