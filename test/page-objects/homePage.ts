import { BasePage } from './basePage';
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

    // Each record row is one button announced as "<trip end date>, <vessel>, <status>, Trip ID <id>".
    recordWithStatus(status: string) {
        return $(`//android.widget.Button[contains(@content-desc, ", ${status}, ")]`);
    }

    get completeDraftOption() {
        return $(
            '//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Complete catch record"]]',
        );
    }

    async continueDraftRecord() {
        logStep('Continuing draft catch record');
        const draft = this.recordWithStatus('Draft');
        await draft.waitForDisplayed();
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
