import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class SelectedSpeciesPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Which species did you catch") and @heading="true"]',
        );
    }

    speciesItemRow(speciesName: string) {
        return $(
            `//android.view.View[@checkable="true" and .//android.widget.TextView[@text="${speciesName}"]]`,
        );
    }

    get retainedWeightField() {
        return $(
            '//android.widget.TextView[@text="Weight above minimum size retained (kg)"]/following-sibling::android.widget.EditText[1]',
        );
    }

    get belowMinWeightField() {
        return $(
            '//android.widget.TextView[@text="Weight below minimum size retained (kg)"]/following-sibling::android.widget.EditText[1]',
        );
    }

    get discardedWeightField() {
        return $(
            '//android.widget.TextView[@text="Weight legally discarded (kg)"]/following-sibling::android.widget.EditText[1]',
        );
    }

    get addBelowMinWeightButton() {
        return $('//android.widget.Button[@text="Add weight below minimum size retained (kg)"]');
    }

    get addDiscardedWeightButton() {
        return $('//android.widget.Button[@text="Add weight legally discarded (kg)"]');
    }

    get removeSpeciesLink() {
        return $('//android.widget.Button[@text="Remove a species"]');
    }

    get addSpeciesLink() {
        return $('//android.widget.Button[@text="Add a species"]');
    }

    async selectSpeciesCheckbox(speciesName: string) {
        logStep(`Selecting species checkbox ${speciesName}`);
        const row = this.speciesItemRow(speciesName);
        await row.waitForDisplayed();
        await row.click();
    }

    async enterRetainedWeight(weight: string | number) {
        logStep(`Entering retained weight ${weight}`);
        await this.retainedWeightField.waitForDisplayed();
        await this.retainedWeightField.setValue(weight.toString());
    }

    async enterBelowMinWeight(weight: string | number) {
        logStep(`Entering below minimum weight ${weight}`);
        await this.scrollUntilDisplayed(this.belowMinWeightField);
        await this.belowMinWeightField.waitForDisplayed();
        await this.belowMinWeightField.setValue(weight.toString());
    }

    async enterDiscardedWeight(weight: string | number) {
        logStep(`Entering discarded weight ${weight}`);
        await this.scrollUntilDisplayed(this.discardedWeightField);
        await this.discardedWeightField.waitForDisplayed();
        await this.discardedWeightField.setValue(weight.toString());
    }

    async clickAddBelowMinWeight() {
        logStep('Clicking add below minimum weight');
        await this.scrollUntilDisplayed(this.addBelowMinWeightButton);
        await this.addBelowMinWeightButton.waitForDisplayed();
        await this.addBelowMinWeightButton.click();
    }

    async clickAddDiscardedWeight() {
        logStep('Clicking add discarded weight');
        await this.scrollUntilDisplayed(this.addDiscardedWeightButton);
        await this.addDiscardedWeightButton.waitForDisplayed();
        await this.addDiscardedWeightButton.click();
    }

    async clickRemoveSpecies() {
        logStep('Clicking remove species');
        await this.removeSpeciesLink.waitForDisplayed();
        await this.removeSpeciesLink.click();
    }

    async clickAddSpecies() {
        logStep('Clicking add species');
        await this.addSpeciesLink.waitForDisplayed();
        await this.addSpeciesLink.click();
    }
}

export default new SelectedSpeciesPage();
