import { BasePage } from './base/basePage';
import { logStep } from '../common/logger';

export class HomePage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Your catch records"]');
    }

    get createRecordButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Create a new catch record"]]',
        );
    }

    // Editable rows (e.g. Draft) are a button announced as "<date>, <vessel>, <status>, Trip ID <id>";
    // read-only rows (e.g. Submitted) render the status as a separate text view inside the row.
    recordWithStatus(status: string) {
        return $(
            `//android.widget.Button[contains(@content-desc, ", ${status}, ")]` +
                ` | //android.widget.HorizontalScrollView//android.widget.TextView[@text="${status}"]`,
        );
    }

    async waitForRecordWithStatus(status: string, timeout = 15000) {
        logStep(`Waiting for a record with status: ${status}`);
        const record = this.recordWithStatus(status);
        // Keep scrolling while waiting, since the row may be below the fold or still syncing.
        await browser.waitUntil(
            async () => {
                if (await record.isDisplayed()) {
                    return true;
                }
                await this.scrollUntilDisplayed(record, { maxSwipes: 3, direction: 'up' });
                await this.scrollUntilDisplayed(record, { maxSwipes: 3, direction: 'down' });
                return record.isDisplayed();
            },
            { timeout, timeoutMsg: `No record with status "${status}" was displayed` },
        );
    }

    get completeDraftOption() {
        return $(
            '//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Complete catch record"]]',
        );
    }

    async continueDraftRecord() {
        logStep('Continuing draft catch record');
        const draft = this.recordWithStatus('Draft');
        await this.waitForRecordWithStatus('Draft');
        await draft.click();
        await this.completeDraftOption.waitForDisplayed();
        await this.completeDraftOption.click();
        await this.saveAndContinue();
    }

    async clickCreateRecordButton() {
        logStep('Clicking create record button');
        await this.createRecordButton.waitForDisplayed();
        await this.createRecordButton.click();
    }
}

export default new HomePage();
