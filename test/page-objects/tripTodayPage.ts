import { BaseYesNoPage } from './base/baseYesNoPage';
import departurePortPage from './departurePortPage';
import tripStartDatePage from './tripStartDatePage';

export class TripTodayPage extends BaseYesNoPage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Did your trip start and finish today?" and @heading="true"]',
        );
    }

    override async selectYes() {
        await super.selectYes();
        await departurePortPage.heading.waitForDisplayed();
    }

    override async selectNo() {
        await super.selectNo();
        await tripStartDatePage.heading.waitForDisplayed();
    }
}

export default new TripTodayPage();
