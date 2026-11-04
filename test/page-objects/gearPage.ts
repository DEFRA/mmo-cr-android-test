import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class GearPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="What gear did you use?" and @heading="true"]');
    }

    get gearSearchField() {
        return $('//android.widget.EditText');
    }

    gearOption(gearName: string) {
        return $(
            `//android.view.View[@clickable="true" or @checkable="true"][.//android.widget.TextView[contains(@text, "${gearName}")]]`,
        );
    }

    get firstGearSuggestion() {
        return $(
            '(//android.widget.ScrollView//android.view.View[@clickable="true"][.//android.widget.Button])[1]',
        );
    }

    async enterGearName(gearName: string) {
        logStep(`Entering gear name ${gearName}`);
        await this.gearSearchField.waitForDisplayed();
        await this.gearSearchField.setValue(gearName);
        if (gearName.trim().length >= 2) {
            await this.firstGearSuggestion.waitForDisplayed();
        }
    }

    async searchAndSelectGear(searchText: string, gearName: string) {
        logStep(`Searching for ${searchText} and selecting gear ${gearName}`);
        await this.enterGearName(searchText);
        const option = this.gearOption(gearName);
        await option.waitForDisplayed();
        await option.click();
    }

    async searchSelectAndContinue(searchText: string, gearName: string) {
        logStep(`Searching, selecting and continuing: ${gearName}`);
        await this.searchAndSelectGear(searchText, gearName);
        await this.saveAndContinue();
    }
}

export default new GearPage();
