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

    async clickCreateRecordButton() {
        logStep('Clicking create record button');
        await this.createRecordButton.waitForDisplayed();
        await this.createRecordButton.click();
    }
}

export default new HomePage();
