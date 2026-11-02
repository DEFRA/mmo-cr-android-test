import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class SubmissionSuccessPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[(@text="Your catch record has been submitted" or @text="Your catch record has been recorded") and @heading="true"]',
        );
    }

    get referenceText() {
        return $('//android.widget.TextView[contains(@text, "Your catch record reference")]');
    }

    get viewRecordsButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="View your catch records"]]',
        );
    }

    get checkYourCatchRecordsButton() {
        return $('//android.widget.Button[@text="Check your catch records"]');
    }

    get sendRecordInstructionText() {
        return $(
            '//android.widget.TextView[@text="Send your catch record to complete this submission"]',
        );
    }

    get offlineRecordedText() {
        return $(
            '//android.widget.TextView[contains(@text, "Your catch record has been saved and will be sent automatically")]',
        );
    }

    get statusSubmittedFollowOnText() {
        return $(
            '//android.widget.TextView[contains(@text, "make sure the status changes to Submitted")]',
        );
    }

    get within24HoursWarningText() {
        return $(
            '//android.widget.TextView[@text="You must record your catch within 24 hours of landing."]',
        );
    }

    get awaitingSyncNotification() {
        return $(
            '//android.widget.TextView[contains(@text, "not yet been sent") or contains(@text, "saved and sent when you\'re back online") or contains(@text, "Awaiting Sync") or contains(@text, "offline")]',
        );
    }

    async isAwaitingSyncNotificationDisplayed(): Promise<boolean> {
        logStep('Checking if awaiting sync / offline notification is displayed');
        try {
            await this.awaitingSyncNotification.waitForDisplayed({ timeout: 5000 });
            return await this.awaitingSyncNotification.isDisplayed();
        } catch {
            return false;
        }
    }

    async getRecordReference(): Promise<string> {
        logStep('Getting record reference');
        await this.referenceText.waitForDisplayed({ timeout: 10000 });
        const text = await this.referenceText.getText();

        const prefix = 'reference ';
        let reference = text;
        if (text.includes(prefix)) {
            reference = text.split(prefix)[1].trim();
        }
        logStep(`Record reference is ${reference}`);
        return reference;
    }

    async clickViewRecords() {
        logStep('Clicking view records');
        await this.viewRecordsButton.waitForDisplayed({ timeout: 10000 });
        await this.viewRecordsButton.click();
    }
}

export default new SubmissionSuccessPage();
