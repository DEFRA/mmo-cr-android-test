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

    private weightField(contentDesc: string) {
        return $(`//android.widget.EditText[.//android.view.View[@content-desc="${contentDesc}"]]`);
    }

    private addWeightButton(label: string) {
        return $(`//android.widget.Button[@text="Add ${label}"]`);
    }

    get retainedWeightField() {
        return this.weightField('Weight above minimum size retained (kg)');
    }

    get belowMinWeightField() {
        return this.weightField('Weight below minimum size retained (kg)');
    }

    get discardedWeightField() {
        return this.weightField('Weight legally discarded (kg)');
    }

    get addBelowMinWeightButton() {
        return this.addWeightButton('weight below minimum size retained (kg)');
    }

    get addDiscardedWeightButton() {
        return this.addWeightButton('weight legally discarded (kg)');
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

    private async enterWeight(
        label: string,
        field: ChainablePromiseElement,
        weight: string | number,
    ) {
        logStep(`Entering ${label} weight ${weight}`);
        await this.scrollUntilDisplayed(field);
        await field.waitForDisplayed();
        await field.clearValue();
        await field.setValue(weight.toString());
    }

    async enterRetainedWeight(weight: string | number) {
        await this.enterWeight('retained', this.retainedWeightField, weight);
    }

    async enterBelowMinWeight(weight: string | number) {
        await this.enterWeight('below minimum', this.belowMinWeightField, weight);
    }

    async enterDiscardedWeight(weight: string | number) {
        await this.enterWeight('discarded', this.discardedWeightField, weight);
    }

    async clickAddBelowMinWeight() {
        logStep('Clicking add below minimum weight');
        await this.tap(this.addBelowMinWeightButton);
    }

    async clickAddDiscardedWeight() {
        logStep('Clicking add discarded weight');
        await this.tap(this.addDiscardedWeightButton);
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
