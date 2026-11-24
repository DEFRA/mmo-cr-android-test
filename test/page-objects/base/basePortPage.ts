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
        // The previous port screen's search field can linger during the transition, so look for
        // Add port first rather than treating any visible search field as this screen's.
        try {
            await this.addPortButton.waitForDisplayed({ timeout: 3000 });
        } catch {
            logStep('No saved ports, port search already displayed');
            await this.searchField.waitForDisplayed();
            return;
        }
        logStep('Clicking Add port');
        await this.addPortButton.click();
    }
}
