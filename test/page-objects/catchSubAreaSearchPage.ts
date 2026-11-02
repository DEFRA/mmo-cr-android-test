import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class CatchSubAreaSearchPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Select the statistical sub area") and @heading="true"]',
        );
    }

    get searchHint() {
        return $('//android.widget.TextView[contains(@text, "Type to search")]');
    }

    get searchField() {
        return $('//android.widget.EditText');
    }

    searchResult(areaCode: string) {
        return $(
            `//android.view.View[@clickable="true"][.//android.widget.TextView[@text="${areaCode}"]]`,
        );
    }

    get allSearchResults() {
        return $$('//android.view.View[@clickable="true"][.//android.widget.Button]');
    }

    async getAvailableResults(): Promise<string[]> {
        logStep('Getting available search results');
        const results = await this.allSearchResults;
        const codes: string[] = [];
        for (const result of results) {
            const textEl = await result.$('android.widget.TextView');
            const text = await textEl.getText();
            if (text !== 'Save and continue') {
                codes.push(text);
            }
        }
        return codes;
    }

    async enterSearchText(searchText: string) {
        logStep(`Entering search text: ${searchText}`);
        await this.searchField.waitForDisplayed({ timeout: 10000 });
        await this.searchField.setValue(searchText);
    }

    async clearSearchText() {
        logStep('Clearing search text');
        await this.searchField.waitForDisplayed({ timeout: 10000 });
        await this.searchField.clearValue();
    }

    async selectResult(areaCode: string) {
        logStep(`Selecting search result: ${areaCode}`);
        const result = this.searchResult(areaCode);
        await result.waitForDisplayed({ timeout: 10000 });
        await result.click();
    }

    async selectFirstResult() {
        logStep('Selecting first search result');
        const results = await this.allSearchResults;
        if ((await results.length) === 0) {
            throw new Error('No search results available');
        }
        await results[0].click();
    }

    async searchAndSelect(searchText: string, areaCode: string) {
        logStep(`Searching for "${searchText}" and selecting: ${areaCode}`);
        await this.enterSearchText(searchText);
        await this.selectResult(areaCode);
    }

    async searchSelectAndContinue(searchText: string, areaCode: string) {
        logStep(`Searching, selecting and continuing: ${areaCode}`);
        await this.searchAndSelect(searchText, areaCode);
        await this.saveAndContinue();
    }

    async searchSelectFirstAndContinue(searchText: string) {
        logStep(`Searching for "${searchText}" and selecting first result`);
        await this.enterSearchText(searchText);
        await this.selectFirstResult();
        await this.saveAndContinue();
    }
}

export default new CatchSubAreaSearchPage();
