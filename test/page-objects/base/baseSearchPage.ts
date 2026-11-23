import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

export abstract class BaseSearchPage extends BasePage {
    protected readonly waitForSuggestions: boolean = true;
    protected readonly scrollToResult: boolean = false;

    abstract searchResult(name: string): ChainablePromiseElement;

    get searchField() {
        return $('//android.widget.EditText');
    }

    get firstSuggestion() {
        return $(
            '(//android.widget.ScrollView//android.view.View[@clickable="true"][.//android.widget.Button])[1]',
        );
    }

    async enterSearchText(text: string) {
        logStep(`Entering search text ${text}`);
        await this.searchField.waitForDisplayed();
        await this.searchField.setValue(text);
        // Suggestions only appear once at least two characters have been typed.
        if (this.waitForSuggestions && text.trim().length >= 2) {
            await this.firstSuggestion.waitForDisplayed();
        }
    }

    async searchAndSelect(searchText: string, name: string) {
        logStep(`Searching for ${searchText} and selecting ${name}`);
        await this.enterSearchText(searchText);
        const result = this.searchResult(name);
        if (this.scrollToResult) {
            await this.hideKeyboard();
            await this.scrollUntilDisplayed(result);
        }
        await result.waitForDisplayed();
        await result.click();
    }

    async searchSelectAndContinue(searchText: string, name: string) {
        logStep(`Searching, selecting and continuing: ${name}`);
        await this.searchAndSelect(searchText, name);
        await this.saveAndContinue();
    }
}
