import { BasePage } from './base/basePage';
import { logStep } from '../common/logger';

export class SelectedSpeciesPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Which species did you catch") and @heading="true"]',
        );
    }

    get weightInstructions() {
        return $('//android.widget.TextView[contains(@text, "Select all the species you caught")]');
    }

    speciesItemRow(speciesName: string) {
        return $(
            `//android.view.View[@checkable="true" and .//android.widget.TextView[@text="${speciesName}"]]`,
        );
    }

    get retainedWeightField() {
        return $(
            '//android.widget.EditText[.//android.view.View[@content-desc="Weight above minimum size retained (kg)"]]',
        );
    }

    get belowMinWeightField() {
        return $(
            '//android.widget.EditText[.//android.view.View[@content-desc="Weight below minimum size retained (kg)"]]',
        );
    }

    get discardedWeightField() {
        return $(
            '//android.widget.EditText[.//android.view.View[@content-desc="Weight legally discarded (kg)"]]',
        );
    }

    get addBelowMinWeightButton() {
        return $('//android.widget.Button[@text="Add weight below minimum size retained (kg)"]');
    }

    get addDiscardedWeightButton() {
        return $('//android.widget.Button[@text="Add weight legally discarded (kg)"]');
    }

    get removeBelowMinWeightButton() {
        return $('//android.widget.Button[@text="Remove weight below minimum size retained (kg)"]');
    }

    get removeDiscardedWeightButton() {
        return $('//android.widget.Button[@text="Remove weight legally discarded (kg)"]');
    }

    get removeSpeciesLink() {
        return $('//android.widget.Button[@text="Remove a species"]');
    }

    get addSpeciesLink() {
        return $('//android.widget.Button[@text="Add a species"]');
    }

    async waitForLoaded() {
        await this.addSpeciesLink.waitForDisplayed();
    }

    async selectSpeciesCheckbox(speciesName: string) {
        logStep(`Selecting species checkbox ${speciesName}`);
        const row = this.speciesItemRow(speciesName);
        await row.waitForDisplayed();
        await row.click();
    }

    private async tap(button: ChainablePromiseElement) {
        await this.scrollUntilDisplayed(button);
        await button.waitForDisplayed();
        await button.click();
    }

    async enterRetainedWeight(weight: string | number) {
        logStep(`Entering retained weight ${weight}`);
        await this.scrollUntilDisplayed(this.retainedWeightField);
        await this.retainedWeightField.waitForDisplayed();
        await this.retainedWeightField.clearValue();
        await browser.pause(500);
        await this.retainedWeightField.setValue(weight.toString());
    }

    async enterBelowMinWeight(weight: string | number) {
        logStep(`Entering below minimum weight ${weight}`);
        await this.scrollUntilDisplayed(this.belowMinWeightField);
        await this.belowMinWeightField.waitForDisplayed();
        await this.belowMinWeightField.clearValue();
        await browser.pause(500);
        await this.belowMinWeightField.setValue(weight.toString());
    }

    async enterDiscardedWeight(weight: string | number) {
        logStep(`Entering discarded weight ${weight}`);
        await this.scrollUntilDisplayed(this.discardedWeightField);
        await this.discardedWeightField.waitForDisplayed();
        await this.discardedWeightField.clearValue();
        await browser.pause(500);
        await this.discardedWeightField.setValue(weight.toString());
    }

    async clickAddBelowMinWeight() {
        logStep('Clicking add below minimum weight');
        await this.tap(this.addBelowMinWeightButton);
    }

    async clickAddDiscardedWeight() {
        logStep('Clicking add discarded weight');
        await this.tap(this.addDiscardedWeightButton);
    }

    async clickRemoveBelowMinWeight() {
        logStep('Clicking remove below minimum weight');
        await this.tap(this.removeBelowMinWeightButton);
    }

    async clickRemoveDiscardedWeight() {
        logStep('Clicking remove discarded weight');
        await this.tap(this.removeDiscardedWeightButton);
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
