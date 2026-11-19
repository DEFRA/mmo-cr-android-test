import { BasePage } from './base/basePage';
import { logStep } from '../common/logger';

// TODO(CRAR-165): stub page for the late submission warning (AC09).
// Confirm the heading and acknowledge button against the app.
export class LateSubmissionWarningPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="TODO(CRAR-165): late submission warning heading" and @heading="true"]',
        );
    }

    get acknowledgeButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="TODO(CRAR-165): acknowledge late submission"]]',
        );
    }

    async acknowledge() {
        logStep('Acknowledging late submission warning');
        await this.acknowledgeButton.waitForDisplayed();
        await this.acknowledgeButton.click();
    }
}

export default new LateSubmissionWarningPage();
