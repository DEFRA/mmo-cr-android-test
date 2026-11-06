import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class CatchSubAreaPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Select the statistical sub area") and @heading="true"]',
        );
    }

    subAreaOption(areaCode: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${areaCode}"]]`,
        );
    }

    get subAreaOptions() {
        return $$('//android.view.View[@checkable="true"][.//android.widget.RadioButton]');
    }

    get otherOption() {
        return this.subAreaOption('Other');
    }

    get otherRadioButton() {
        return this.otherOption.$('android.widget.RadioButton');
    }

    get subAreaSearchField() {
        return $('//android.widget.EditText');
    }

    // Each result row holds the code and "ICES rectangle 27E1, centre 49.25°N, 8.83°W"; rows clipped off screen have no text.
    get suggestions() {
        return $$(
            '//android.view.View[@clickable="true" and not(@checkable="true")][.//android.widget.TextView[contains(@text, "°")]]',
        );
    }

    suggestion(areaCode: string) {
        return $(
            `//android.view.View[@clickable="true" and not(@checkable="true")][.//android.widget.TextView[@text="${areaCode}"]]`,
        );
    }

    // Shows "No area selected" until a result is chosen.
    get selectedArea() {
        return $('//android.widget.EditText/following-sibling::android.widget.TextView[1]');
    }

    private async hideKeyboard() {
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
    }

    // The screen can open already scrolled down, leaving the heading off screen.
    async scrollToTop() {
        await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(5)');
    }

    async selectOther() {
        logStep('Selecting Other sub area');
        await this.scrollUntilDisplayed(this.otherOption);
        await this.otherOption.click();
        await this.otherRadioButton.waitForDisplayed();
        await this.otherRadioButton.click();
        await driver.waitUntil(
            async () => (await this.otherOption.getAttribute('checked')) === 'true',
            { timeoutMsg: 'Other sub area radio button was not selected.' },
        );
        try {
            await this.subAreaSearchField.waitForDisplayed({ timeout: 3000 });
        } catch {
            await this.saveAndContinue();
            await this.subAreaSearchField.waitForDisplayed();
        }
    }

    async enterSubAreaCode(text: string) {
        logStep(`Entering sub area code: ${text}`);
        await this.subAreaSearchField.waitForDisplayed();
        await this.subAreaSearchField.setValue(text);
    }

    override async saveAndContinue() {
        await this.hideKeyboard();
        await super.saveAndContinue();
    }

    async getSuggestionTexts(): Promise<string[][]> {
        logStep('Getting sub area suggestions');
        await driver.waitUntil(async () => (await this.suggestions.length) > 0, {
            timeoutMsg: 'No sub area suggestions were displayed.',
        });
        const results: string[][] = [];
        for (const suggestion of await this.suggestions) {
            const texts: string[] = [];
            for (const textView of await suggestion.$$('android.widget.TextView')) {
                texts.push(await textView.getText());
            }
            results.push(texts);
        }
        return results;
    }

    async getSuggestionText(areaCode: string): Promise<string[]> {
        const suggestion = this.suggestion(areaCode);
        await this.hideKeyboard();
        await this.scrollUntilDisplayed(suggestion);
        await suggestion.waitForDisplayed();
        const texts: string[] = [];
        for (const textView of await suggestion.$$('android.widget.TextView')) {
            texts.push(await textView.getText());
        }
        return texts;
    }

    async selectSuggestion(areaCode: string) {
        logStep(`Selecting sub area suggestion ${areaCode}`);
        const suggestion = this.suggestion(areaCode);
        await this.hideKeyboard();
        await this.scrollUntilDisplayed(suggestion);
        await suggestion.waitForDisplayed();
        await suggestion.click();
    }

    // Returns the "49.25°N, 8.83°W" part of the result's ICES rectangle line.
    async getSuggestionCoordinates(areaCode: string): Promise<string> {
        logStep(`Getting coordinates for sub area ${areaCode}`);
        const texts = await this.getSuggestionText(areaCode);
        const match = texts.join(' ').match(/centre\s+(.+°[NS],\s*.+°[EW])/);
        if (!match?.[1]) {
            throw new Error(`No coordinates shown for sub area ${areaCode}: ${texts.join(' | ')}`);
        }
        return match[1];
    }

    async getAvailableSubAreas(): Promise<string[]> {
        logStep('Getting available sub area codes');
        const options = await this.subAreaOptions;
        const codes: string[] = [];
        for (const option of options) {
            const textEl = await option.$('android.widget.TextView');
            const text = await textEl.getText();
            if (text !== 'Other') {
                codes.push(text);
            }
        }
        return codes;
    }

    async selectSubArea(areaCode: string) {
        logStep(`Selecting sub area ${areaCode}`);
        const option = this.subAreaOption(areaCode);
        await option.waitForDisplayed();
        await option.click();
    }

    async selectFirstSubArea() {
        logStep('Selecting first available sub area');
        const codes = await this.getAvailableSubAreas();
        const [firstCode] = codes;
        if (!firstCode) {
            throw new Error('No sub area options available');
        }
        await this.selectSubArea(firstCode);
    }

    async selectSubAreaAndContinue(areaCode: string) {
        logStep(`Selecting sub area and continuing: ${areaCode}`);
        await this.selectSubArea(areaCode);
        await this.saveAndContinue();
    }

    async selectFirstSubAreaAndContinue() {
        logStep('Selecting first sub area and continuing');
        await this.selectFirstSubArea();
        await this.saveAndContinue();
    }
}

export default new CatchSubAreaPage();
