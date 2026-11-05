import { BasePage } from './basePage';
import { logStep } from '../common/logger';
import tripTodayPage from './tripTodayPage';

export class SelectVesselPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Which vessel did you use?" and @heading="true"]',
        );
    }

    // Option labels include the PLN (e.g. "ACHILLES PH1234"), so match by name prefix.
    vesselOption(vesselName: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[starts-with(@text, "${vesselName}")]]`,
        );
    }

    async selectVessel(vesselName: string) {
        logStep(`Selecting vessel ${vesselName}`);
        const option = this.vesselOption(vesselName);
        await option.waitForDisplayed();
        await option.click();
        await tripTodayPage.heading.waitForDisplayed();
    }
}

export default new SelectVesselPage();
