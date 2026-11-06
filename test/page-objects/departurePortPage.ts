import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class DeparturePortPage extends BasePage {
    // The screen shows either the port search heading or, when saved ports exist, the select-port heading.
    get heading() {
        return $(
            '//android.widget.TextView[@heading="true" and (@text="Enter the port or closest port you set off from" or @text="Select the port you set off from")]',
        );
    }

    get addPortButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Add port"]]',
        );
    }

    get portSearchField() {
        return $('//android.widget.EditText');
    }

    portSuggestion(portName: string) {
        return $(
            `//android.view.View[@clickable="true"][.//android.widget.TextView[@text="${portName}"]]`,
        );
    }

    get firstPortSuggestion() {
        return $(
            '(//android.widget.ScrollView//android.view.View[@clickable="true"][.//android.widget.Button])[1]',
        );
    }

    // "Add port" only appears once saved ports exist; on first use the search field is shown directly.
    async clickAddPort() {
        if (await this.portSearchField.isDisplayed()) {
            logStep('No saved ports, port search already displayed');
            return;
        }
        logStep('Clicking Add port');
        await this.addPortButton.waitForDisplayed();
        await this.addPortButton.click();
    }

    async enterPortName(portName: string) {
        logStep(`Entering port name ${portName}`);
        await this.portSearchField.waitForDisplayed();
        await this.portSearchField.setValue(portName);
        if (portName.trim().length >= 2) {
            await this.firstPortSuggestion.waitForDisplayed();
        }
    }

    async searchAndSelectPort(searchText: string, portName: string) {
        logStep(`Searching for ${searchText} and selecting port ${portName}`);
        await this.enterPortName(searchText);
        const suggestion = this.portSuggestion(portName);
        // The keyboard overlaps the lower results, so swipes and taps would land on it.
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
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

export default new DeparturePortPage();
