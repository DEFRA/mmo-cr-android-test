import { BasePage } from './base/basePage';
import { logStep } from '../common/logger';

export class GearMeasurementPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Enter the measurements for") and @heading="true"]',
        );
    }

    get meshSizeField() {
        return $('//android.widget.EditText');
    }

    async enterMeshSize(size: string | number) {
        logStep(`Entering mesh size ${size}`);
        await this.meshSizeField.waitForDisplayed();
        await this.meshSizeField.setValue(size.toString());
    }

    async enterMeshSizeAndContinue(size: string | number) {
        logStep(`Entering mesh size and continuing: ${size}`);
        await this.enterMeshSize(size);
        await this.saveAndContinue();
    }
}

export default new GearMeasurementPage();
