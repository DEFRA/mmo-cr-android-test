import { BaseSearchPage } from './base/baseSearchPage';

export class GearPage extends BaseSearchPage {
    get heading() {
        return $('//android.widget.TextView[@text="What gear did you use?" and @heading="true"]');
    }

    searchResult(gearName: string) {
        return $(
            `//android.view.View[@clickable="true" or @checkable="true"][.//android.widget.TextView[contains(@text, "${gearName}")]]`,
        );
    }
}

export default new GearPage();
