import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class TripTodayPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Did your trip start and finish today?" and @heading="true"]',
        );
    }

    get yesOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Yes"]]');
    }

    get noOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="No"]]');
    }

    async selectYes() {
        logStep('Selecting Yes');
        await this.yesOption.waitForDisplayed({ timeout: 10000 });
        await this.yesOption.click();
    }

    async selectNo() {
        logStep('Selecting No');
        await this.noOption.waitForDisplayed({ timeout: 10000 });
        await this.noOption.click();
    }

    async selectYesAndContinue() {
        logStep('Selecting Yes and continuing');
        await this.selectYes();
        await this.saveAndContinue();
    }

    async selectNoAndContinue() {
        logStep('Selecting No and continuing');
        await this.selectNo();
        await this.saveAndContinue();
    }
}

export default new TripTodayPage();
