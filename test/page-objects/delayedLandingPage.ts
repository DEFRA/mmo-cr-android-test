import { BaseYesNoPage } from './base/baseYesNoPage';
import { logStep } from '../common/logger';

export class DelayedLandingPage extends BaseYesNoPage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Is there any catch from this trip that you will not be landing straight away?" and @heading="true"]',
        );
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

export default new DelayedLandingPage();
