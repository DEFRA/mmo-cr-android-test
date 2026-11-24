import { BasePage } from './base/basePage';
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

    async waitForLoaded() {
        await this.addSpeciesLink.waitForDisplayed();
    }

    async selectSpeciesCheckbox(speciesName: string) {
        logStep(`Selecting species checkbox ${speciesName}`);
        const row = this.speciesItemRow(speciesName);
        await row.waitForDisplayed();
        await row.click();
    }

    private async fill(field: ChainablePromiseElement, weight: string | number) {
        await this.scrollUntilDisplayed(field);
        await field.waitForDisplayed();
        await field.setValue(weight.toString());
    }

    private async tap(button: ChainablePromiseElement) {
        await this.scrollUntilDisplayed(button);
        await button.waitForDisplayed();
        await button.click();
    }

    async enterRetainedWeight(weight: string | number) {
        logStep(`Entering retained weight ${weight}`);
        await this.fill(this.retainedWeightField, weight);
    }

    async enterBelowMinWeight(weight: string | number) {
        logStep(`Entering below minimum weight ${weight}`);
        await this.fill(this.belowMinWeightField, weight);
    }

    async enterDiscardedWeight(weight: string | number) {
        logStep(`Entering discarded weight ${weight}`);
        await this.fill(this.discardedWeightField, weight);
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
