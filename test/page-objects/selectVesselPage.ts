import { BasePage } from './basePage';
import { logStep } from '../common/logger';
import tripTodayPage from './tripTodayPage';

export class SelectVesselPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Which vessel did you use?" and @heading="true"]',
        );
    }

    vesselOption(vesselName: string) {
        return $(`//android.widget.TextView[@text="${vesselName}"]`);
    }

    async selectVessel(vesselName: string) {
        logStep(`Selecting vessel ${vesselName}`);
        const option = this.vesselOption(vesselName);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
        await tripTodayPage.heading.waitForDisplayed({ timeout: 10000 });
    }
}

export default new SelectVesselPage();
