import { BasePage } from './basePage';
import { logStep, logWarn } from '../common/logger';

export class CatchRecordSummaryPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Check your catch record" and @heading="true"]');
    }

    fieldValue(label: string) {
        return $(
            `//android.widget.TextView[@text="${label}"]/following-sibling::android.widget.TextView[1]`,
        );
    }

    changeButton(label: string) {
        return $(`//android.widget.Button[@content-desc="Change ${label}"]`);
    }

    get speciesCaughtHeading() {
        return $('//android.widget.TextView[@text="Species caught"]');
    }

    get declarationText() {
        return $(
            '//android.widget.TextView[@text="By submitting this record, you agree that the information you\'ve given is complete and correct."]',
        );
    }

    get declarationBulletWeightAccurate() {
        return $(
            '//android.widget.TextView[@text="The weight of fish you have landed is accurate"]',
        );
    }

    get declarationBulletToleranceLevels() {
        return $('//android.widget.TextView[@text="This is within permitted tolerance levels"]');
    }

    get declarationBulletFishingAuthorities() {
        return $(
            '//android.widget.TextView[@text="Fishing authorities may take action in respect of inaccurate catch recording"]',
        );
    }

    get offlineWarningText() {
        return $(
            '//android.widget.TextView[contains(@text, "You\'re offline. If you submit now")]',
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
        await field.waitForDisplayed({ timeout: 10000 });
        return field.getText();
    }

    async clickChangeForField(label: string) {
        logStep(`Clicking change for field ${label}`);
        const btn = this.changeButton(label);
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }

    async acceptAndSubmit() {
        logStep('Clicking accept and submit');
        try {
            await this.acceptAndSubmitButton.waitForDisplayed({ timeout: 1000 });
        } catch (error) {
            logWarn('CatchRecordSummaryPage: Accept and submit button not visible, scrolling');
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollForward()');
            await this.acceptAndSubmitButton.waitForDisplayed({ timeout: 1000 });
        }
        await this.acceptAndSubmitButton.click();
    }
}

export default new CatchRecordSummaryPage();
