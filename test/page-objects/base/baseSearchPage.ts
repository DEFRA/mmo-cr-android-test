import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

export abstract class BaseSearchPage extends BasePage {
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
        if (text.trim().length >= 2) {
            await this.firstSuggestion.waitForDisplayed();
        }
    }
}
