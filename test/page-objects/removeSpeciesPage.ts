import { BasePage } from './base/basePage';
import { logStep } from '../common/logger';

export class RemoveSpeciesPage extends BasePage {
    // Example: "Remove a species caught with seine nets (mesh size 10mm)".
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Remove a species caught") and @heading="true"]',
        );
    }

    get instructions() {
        return $(
            '//android.widget.TextView[@text="Select the species you want to remove, then delete them."]',
        );
    }

    speciesItemRow(speciesName: string) {
        return $(
            `//android.view.View[@checkable="true" and .//android.widget.TextView[@text="${speciesName}"]]`,
        );
    }

    get deleteButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Delete"]]',
        );
    }

    async selectSpeciesForRemoval(speciesName: string) {
        logStep(`Selecting species for removal: ${speciesName}`);
        const row = this.speciesItemRow(speciesName);
        await row.waitForDisplayed();
        await row.click();
    }

    async deleteSelectedSpecies() {
        logStep('Deleting selected species');
        await this.deleteButton.waitForDisplayed();
        await this.deleteButton.click();
    }
}

export default new RemoveSpeciesPage();
