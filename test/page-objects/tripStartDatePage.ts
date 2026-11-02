import { BaseDatePage } from './baseDatePage';
import tripEndDatePage from './tripEndDatePage';

export class TripStartDatePage extends BaseDatePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="What date did your trip start?" and @heading="true"]',
        );
    }

    override async enterDateAndContinue(day: string, month: string, year: string) {
        await super.enterDateAndContinue(day, month, year);
        await tripEndDatePage.heading.waitForDisplayed({ timeout: 10000 });
    }
}

export default new TripStartDatePage();
