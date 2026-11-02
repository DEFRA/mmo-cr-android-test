import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class SelectedGearsPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="What gear did you use?" and @heading="true"]');
    }

    get instructionText() {
        return $('//android.widget.TextView[@text="Select all the gears used on your vessel."]');
    }

    gearItemRow(gearName: string) {
        return $(
            `//android.view.View[@checkable="true" and .//android.widget.TextView[@text="${gearName}"]]`,
        );
    }

    gearItemMeasurement(gearName: string) {
        return $(
            `//android.view.View[@checkable="true" and .//android.widget.TextView[@text="${gearName}"]]//android.widget.TextView[2]`,
        );
    }

    get shotsLabel() {
        return $('//android.widget.TextView[@text="Number of times gear was shot on trip"]');
    }

    get shotsField() {
        return $('//android.widget.EditText');
    }

    get removeGearButton() {
        return $('//android.widget.Button[@text="Remove gear"]');
    }

    get addAnotherGearButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Add another gear"]]',
        );
    }

    async selectGearCheckbox(gearName: string) {
        logStep(`Selecting gear checkbox ${gearName}`);
        const row = this.gearItemRow(gearName);
        await row.waitForDisplayed({ timeout: 10000 });
        await row.click();
    }

    async clickRemoveGear() {
        logStep('Clicking remove gear');
        await this.removeGearButton.waitForEnabled({ timeout: 10000 });
        await this.removeGearButton.click();
    }

    async removeGear(gearName: string) {
        logStep(`Removing gear ${gearName}`);
        await this.selectGearCheckbox(gearName);
        await this.clickRemoveGear();
    }

    async clickAddAnotherGear() {
        logStep('Clicking add another gear');
        await this.addAnotherGearButton.waitForDisplayed({ timeout: 10000 });
        await this.addAnotherGearButton.click();
    }

    async enterShots(shots: string | number) {
        logStep(`Entering shots ${shots}`);
        await this.shotsField.waitForDisplayed({ timeout: 10000 });
        await this.shotsField.setValue(shots.toString());
    }
}

export default new SelectedGearsPage();
