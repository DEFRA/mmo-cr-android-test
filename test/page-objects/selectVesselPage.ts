import { BasePage } from './basePage';
import { logStep } from '../common/logger';

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
    }

    async selectVesselAndContinue(vesselName: string) {
        logStep(`Selecting vessel and continuing: ${vesselName}`);
        await this.selectVessel(vesselName);
        await this.saveAndContinue();
    }
}

export default new SelectVesselPage();
