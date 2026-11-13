import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

export abstract class BaseYesNoPage extends BasePage {
    get yesOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Yes"]]');
    }

    get noOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="No"]]');
    }

    async selectYes() {
        logStep('Selecting Yes');
        await this.yesOption.waitForDisplayed();
        await this.yesOption.click();
    }

    async selectNo() {
        logStep('Selecting No');
        await this.noOption.waitForDisplayed();
        await this.noOption.click();
    }
}
