import { BaseSearchPage } from './base/baseSearchPage';
import { logStep } from '../common/logger';

export class GearPage extends BaseSearchPage {
    get heading() {
        return $('//android.widget.TextView[@text="What gear did you use?" and @heading="true"]');
    }

    gearOption(gearName: string) {
        return $(
            `//android.view.View[@clickable="true" or @checkable="true"][.//android.widget.TextView[contains(@text, "${gearName}")]]`,
        );
    }

    async searchAndSelectGear(searchText: string, gearName: string) {
        logStep(`Searching for ${searchText} and selecting gear ${gearName}`);
        await this.enterSearchText(searchText);
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
