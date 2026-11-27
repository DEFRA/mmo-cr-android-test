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
        // Keep checking while waiting, since the row may be below the fold or still syncing.
        await browser.waitUntil(
            async () => {
                if (await record.isDisplayed()) {
                    return true;
                }
                await this.scrollUntilDisplayed(record, { maxSwipes: 3 });
                if (await record.isDisplayed()) {
                    return true;
                }
                await this.scrollToTop();
                return false;
            },
            { timeout, timeoutMsg: `No record with status "${status}" was displayed` },
        );
    }

    get homeTab() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Home"]]',
        );
    }

    get completeDraftOption() {
        return $(
            '//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Complete catch record"]]',
        );
    }

    get deleteDraftOption() {
        return $(
            '//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Delete catch record"]]',
        );
    }

    get confirmDeleteDraftButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Delete draft"]]',
        );
    }

    async openDraftRecord(): Promise<string | undefined> {
        logStep('Opening draft catch record');
        const draft = this.recordWithStatus('Draft');
        await this.waitForRecordWithStatus('Draft');
        const description = await draft.getAttribute('content-desc');
        await draft.click();
        await this.completeDraftOption.waitForDisplayed();
        return description ?? undefined;
    }

    async continueDraftRecord() {
        logStep('Continuing draft catch record');
        await this.openDraftRecord();
        await this.completeDraftOption.click();
        await this.saveAndContinue();
    }

    recordWithTripId(tripId: string) {
        return $(`//android.widget.Button[contains(@content-desc, ", Trip ID ${tripId}")]`);
    }

    async goToHome() {
        if (await this.heading.isDisplayed()) {
            return;
        }
        logStep('Navigating to home page');
        await this.homeTab.waitForDisplayed();
        await this.homeTab.click();
        await this.heading.waitForDisplayed();
    }

    // Returns the Trip ID of the deleted draft so callers can confirm it has gone.
    async deleteDraftRecord(): Promise<string> {
        logStep('Deleting draft catch record');
        const description = await this.openDraftRecord();
        const tripId = /Trip ID (\S+)/.exec(description ?? '')?.[1];
        if (!tripId) {
            throw new Error(`Could not read the Trip ID from draft record "${description}"`);
        }
        await this.deleteDraftOption.click();
        await this.saveAndContinue();
        await this.confirmDeleteDraftButton.waitForDisplayed();
        await this.confirmDeleteDraftButton.click();
        await this.heading.waitForDisplayed();
        return tripId;
    }

    async clickCreateRecordButton() {
        logStep('Clicking create record button');
        await this.createRecordButton.waitForDisplayed();
        await this.createRecordButton.click();
    }
}

export default new HomePage();
