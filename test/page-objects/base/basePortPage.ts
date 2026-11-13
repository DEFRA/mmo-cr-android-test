import { BaseSearchPage } from './baseSearchPage';
import { logStep } from '../../common/logger';

export abstract class BasePortPage extends BaseSearchPage {
    abstract get heading(): ChainablePromiseElement;

    get addPortButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Add port"]]',
        );
    }

    portSuggestion(portName: string) {
        return $(
            `//android.view.View[@clickable="true"][.//android.widget.TextView[@text="${portName}"]]`,
        );
    }

    async clickAddPort() {
        if (await this.searchField.isDisplayed()) {
            logStep('No saved ports, port search already displayed');
            return;
        }
        logStep('Clicking Add port');
        await this.addPortButton.waitForDisplayed();
        await this.addPortButton.click();
    }

    async searchAndSelectPort(searchText: string, portName: string) {
        logStep(`Searching for ${searchText} and selecting port ${portName}`);
        await this.enterSearchText(searchText);
        const suggestion = this.portSuggestion(portName);
        await this.hideKeyboard();
        await this.scrollUntilDisplayed(suggestion);
        await suggestion.waitForDisplayed();
        await suggestion.click();
    }

    async searchSelectAndContinue(searchText: string, portName: string) {
        logStep(`Searching, selecting and continuing: ${portName}`);
        await this.searchAndSelectPort(searchText, portName);
        await this.saveAndContinue();
    }
}
