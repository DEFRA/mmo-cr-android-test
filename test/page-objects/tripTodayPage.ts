import { BasePage } from './basePage';
import { logStep } from '../common/logger';
import departurePortPage from './departurePortPage';
import tripStartDatePage from './tripStartDatePage';

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
        await departurePortPage.heading.waitForDisplayed({ timeout: 10000 });
    }

    async selectNo() {
        logStep('Selecting No');
        await this.noOption.waitForDisplayed({ timeout: 10000 });
        await this.noOption.click();
        await tripStartDatePage.heading.waitForDisplayed({ timeout: 10000 });
    }
}

export default new TripTodayPage();
