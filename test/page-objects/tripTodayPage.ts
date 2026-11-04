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
        await this.yesOption.waitForDisplayed();
        await this.yesOption.click();
        await departurePortPage.heading.waitForDisplayed();
    }

    async selectNo() {
        logStep('Selecting No');
        await this.noOption.waitForDisplayed();
        await this.noOption.click();
        await tripStartDatePage.heading.waitForDisplayed();
    }
}

export default new TripTodayPage();
