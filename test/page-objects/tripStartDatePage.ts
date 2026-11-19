import { BaseDatePage } from './base/baseDatePage';
import tripEndDatePage from './tripEndDatePage';

export class TripStartDatePage extends BaseDatePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="What date did your trip start?" and @heading="true"]',
        );
    }

    // TODO(CRAR-165): placeholder locator - confirm the real validation message against the app
    // (Appium Inspector / appium-mcp page source) for a start date over 365 days ago.
    get validationError() {
        return $('//android.widget.TextView[@text="TODO(CRAR-165): trip start date validation"]');
    }

    override async enterDateAndContinue(day: string, month: string, year: string) {
        await super.enterDateAndContinue(day, month, year);
        await tripEndDatePage.heading.waitForDisplayed();
    }
}

export default new TripStartDatePage();
