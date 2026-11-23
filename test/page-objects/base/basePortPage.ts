import { BaseSearchPage } from './baseSearchPage';
import { logStep } from '../../common/logger';

export abstract class BasePortPage extends BaseSearchPage {
    protected override readonly scrollToResult = true;

    abstract get heading(): ChainablePromiseElement;

    get addPortButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Add port"]]',
        );
    }

    searchResult(portName: string) {
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
}
