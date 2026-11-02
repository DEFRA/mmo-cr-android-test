import { BaseDatePage } from './baseDatePage';
import departurePortPage from './departurePortPage';

export class TripEndDatePage extends BaseDatePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="What date did your trip finish?" and @heading="true"]',
        );
    }

    override async enterDateAndContinue(day: string, month: string, year: string) {
        await super.enterDateAndContinue(day, month, year);
        await departurePortPage.heading.waitForDisplayed({ timeout: 10000 });
    }
}

export default new TripEndDatePage();
