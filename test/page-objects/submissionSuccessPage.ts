import { BasePage } from './base/basePage';
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

    async getRecordReference(): Promise<string> {
        logStep('Getting record reference');
        await this.referenceText.waitForDisplayed();
        const text = await this.referenceText.getText();

        const prefix = 'reference ';
        let reference = text;
        if (text.includes(prefix)) {
            reference = text.split(prefix)[1]?.trim() ?? text;
        }
        logStep(`Record reference is ${reference}`);
        return reference;
    }

    async clickViewRecords() {
        logStep('Clicking view records');
        await this.viewRecordsButton.waitForDisplayed();
        await this.viewRecordsButton.click();
    }
}

export default new SubmissionSuccessPage();
