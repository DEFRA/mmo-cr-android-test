import { BaseDatePage } from './base/baseDatePage';
import tripEndDatePage from './tripEndDatePage';

export class TripStartDatePage extends BaseDatePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="What date did your trip start?" and @heading="true"]',
        );
    }

    // TODO(CRAR-165): placeholder - the app does not yet reject start dates over 365 days ago.
    // Replace with the real message once that validation exists.
    get validationError() {
        return $('//android.widget.TextView[@text="TODO(CRAR-165): trip start date validation"]');
    }

    override async enterDateAndContinue(day: string, month: string, year: string) {
        await super.enterDateAndContinue(day, month, year);
        await tripEndDatePage.heading.waitForDisplayed();
    }
}

export default new TripStartDatePage();
