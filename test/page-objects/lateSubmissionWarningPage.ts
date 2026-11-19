import { BasePage } from './base/basePage';
import catchRecordSummaryPage from './catchRecordSummaryPage';
import { logStep } from '../common/logger';

// Shown after the delayed landing question when the trip ended more than 24 hours ago.
export class LateSubmissionWarningPage extends BasePage {
    // The heading includes the number of days late, e.g. "...being submitted 2 days after the trip end date".
    get heading() {
        return $(
            '//android.widget.TextView[starts-with(@text, "This catch record is being submitted") and contains(@text, "after the trip end date") and @heading="true"]',
        );
    }

    async acknowledge() {
        logStep('Acknowledging late submission warning');
        await this.heading.waitForDisplayed();
        await this.saveAndContinue();
        await catchRecordSummaryPage.heading.waitForDisplayed();
    }
}

export default new LateSubmissionWarningPage();
