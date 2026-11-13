import { BasePage } from './base/basePage';
import { logStep } from '../common/logger';

export class SelectedGearsPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="What gear did you use?" and @heading="true"]');
    }

    gearItemRow(gearName: string) {
        return $(
            `//android.view.View[@checkable="true" and .//android.widget.TextView[@text="${gearName}"]]`,
        );
    }

    get shotsField() {
        return $('//android.widget.EditText');
    }

    async selectGearCheckbox(gearName: string) {
        logStep(`Selecting gear checkbox ${gearName}`);
        const row = this.gearItemRow(gearName);
        await row.waitForDisplayed();
        await row.click();
    }

    async enterShots(shots: string | number) {
        logStep(`Entering shots ${shots}`);
        await this.shotsField.waitForDisplayed();
        await this.shotsField.setValue(shots.toString());
    }
}

export default new SelectedGearsPage();
