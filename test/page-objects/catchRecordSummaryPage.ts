import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class CatchRecordSummaryPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Check your catch record" and @heading="true"]');
    }

    fieldValue(label: string) {
        return $(
            `//android.widget.TextView[@text="${label}"]/following-sibling::android.widget.TextView[1]`,
        );
    }

    get acceptAndSubmitButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Accept and submit trip details"]]',
        );
    }

    async getFieldValue(label: string): Promise<string> {
        logStep(`Getting field value for ${label}`);
        const field = this.fieldValue(label);
        await field.waitForDisplayed();
        return field.getText();
    }

    async acceptAndSubmit() {
        logStep('Clicking accept and submit');
        await this.scrollUntilDisplayed(this.acceptAndSubmitButton, { maxSwipes: 10 });
        await this.acceptAndSubmitButton.waitForDisplayed({ timeout: 1000 });
        await this.acceptAndSubmitButton.click();
    }
}

export default new CatchRecordSummaryPage();
