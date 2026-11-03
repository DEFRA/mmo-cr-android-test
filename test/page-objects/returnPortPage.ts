import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class ReturnPortPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Enter the port or closest port you returned to" and @heading="true"]',
        );
    }

    get yesOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Yes"]]');
    }

    get noOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="No"]]');
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

    async selectYes() {
        logStep('Selecting Yes');
        await this.yesOption.waitForDisplayed({ timeout: 10000 });
        await this.yesOption.click();
    }

    async selectNo() {
        logStep('Selecting No');
        await this.noOption.waitForDisplayed({ timeout: 10000 });
        await this.noOption.click();
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

    async selectYesAndContinue() {
        logStep('Selecting Yes and continuing');
        await this.selectYes();
        await this.saveAndContinue();
    }

    async selectNoAndContinue() {
        logStep('Selecting No and continuing');
        await this.selectNo();
        await this.saveAndContinue();
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

export default new ReturnPortPage();
