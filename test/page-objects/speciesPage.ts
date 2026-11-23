import { BaseSearchPage } from './base/baseSearchPage';

export class SpeciesPage extends BaseSearchPage {
    protected override readonly waitForSuggestions = false;

    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Which species did you catch") and @heading="true"]',
        );
    }

    searchResult(speciesName: string) {
        return $(
            `//android.view.View[@clickable="true" or @checkable="true"][.//android.widget.TextView[@text="${speciesName}"]]`,
        );
    }
}

export default new SpeciesPage();
