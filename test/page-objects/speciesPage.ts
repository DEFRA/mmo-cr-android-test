import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class SpeciesPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Which species did you catch") and @heading="true"]',
        );
    }

    get searchField() {
        return $('//android.widget.EditText');
    }

    speciesOption(speciesName: string) {
        return $(
            `//android.view.View[@clickable="true" or @checkable="true"][.//android.widget.TextView[@text="${speciesName}"]]`,
        );
    }

    async enterSpeciesName(species: string) {
        logStep(`Entering species name ${species}`);
        await this.searchField.waitForDisplayed();
        await this.searchField.setValue(species);
    }

    async searchAndSelectSpecies(searchText: string, speciesName: string) {
        logStep(`Searching for ${searchText} and selecting species ${speciesName}`);
        await this.enterSpeciesName(searchText);
        const option = this.speciesOption(speciesName);
        await option.waitForDisplayed();
        await option.click();
    }

    async searchSelectAndContinue(searchText: string, speciesName: string) {
        logStep(`Searching, selecting and continuing: ${speciesName}`);
        await this.searchAndSelectSpecies(searchText, speciesName);
        await this.saveAndContinue();
    }
}

export default new SpeciesPage();
