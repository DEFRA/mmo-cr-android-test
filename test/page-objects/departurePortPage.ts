import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class DeparturePortPage extends BasePage {
    // The screen shows either the port search heading or, when saved ports exist, the select-port heading.
    get heading() {
        return $(
            '//android.widget.TextView[@heading="true" and (@text="Enter the port or closest port you set off from" or @text="Select the port you set off from")]',
        );
    }

    get selectPortHeading() {
        return $(
            '//android.widget.TextView[@text="Select the port you set off from" and @heading="true"]',
        );
    }

    get portConfirmationText() {
        return $(
            '//android.widget.TextView[contains(@text, "the port or the closest port you set off from")]',
        );
    }

    portOption(portName: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${portName}"]]`,
        );
    }

    get allPortOptions() {
        return $$('//android.view.View[@checkable="true"]');
    }

    get addPortButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Add port"]]',
        );
    }

    get portSearchLabel() {
        return $(
            '//android.widget.TextView[@text="Enter the port or closest port you set off from"]',
        );
    }

    get portSearchField() {
        return $('//android.widget.EditText');
    }

    get validationError() {
        return $('//android.widget.TextView[@text="Select a port or choose one from the list"]');
    }

    portSuggestion(portName: string) {
        return $(
            `//android.view.View[@clickable="true"][.//android.widget.TextView[@text="${portName}"]]`,
        );
    }

    get allPortSuggestions() {
        return $$(
            '//android.widget.ScrollView//android.view.View[@clickable="true"][.//android.widget.Button]',
        );
    }

    get firstPortSuggestion() {
        return $(
            '(//android.widget.ScrollView//android.view.View[@clickable="true"][.//android.widget.Button])[1]',
        );
    }

    async selectPort(portName: string) {
        logStep(`Selecting port ${portName}`);
        const option = this.portOption(portName);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async clickAddPort() {
        logStep('Clicking Add port');
        await this.addPortButton.waitForDisplayed({ timeout: 10000 });
        await this.addPortButton.click();
    }

    async selectPortAndContinue(portName: string) {
        logStep(`Selecting port and continuing: ${portName}`);
        await this.selectPort(portName);
        await this.saveAndContinue();
    }

    async enterPortName(portName: string) {
        logStep(`Entering port name ${portName}`);
        await this.portSearchField.waitForDisplayed({ timeout: 10000 });
        await this.portSearchField.setValue(portName);
        if (portName.trim().length >= 2) {
            await this.firstPortSuggestion.waitForDisplayed({ timeout: 10000 });
        }
    }

    async enterPortNameAndContinue(portName: string) {
        logStep(`Entering port name and continuing: ${portName}`);
        await this.enterPortName(portName);
        await this.saveAndContinue();
    }

    async searchAndSelectPort(searchText: string, portName: string) {
        logStep(`Searching for ${searchText} and selecting port ${portName}`);
        await this.enterPortName(searchText);
        const suggestion = this.portSuggestion(portName);
        await suggestion.waitForDisplayed({ timeout: 10000 });
        await suggestion.click();
    }

    async searchSelectAndContinue(searchText: string, portName: string) {
        logStep(`Searching, selecting and continuing: ${portName}`);
        await this.searchAndSelectPort(searchText, portName);
        await this.saveAndContinue();
    }
}

export default new DeparturePortPage();
