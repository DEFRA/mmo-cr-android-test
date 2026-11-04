import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class GearMeasurementPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Enter the measurements for") and @heading="true"]',
        );
    }

    dynamicHeading(gearName: string) {
        return $(
            `//android.widget.TextView[@text="Enter the measurements for ${gearName}" and @heading="true"]`,
        );
    }

    get instructionText() {
        return $('//android.widget.TextView[@text="All gear measurements must be whole numbers."]');
    }

    get meshSizeLabel() {
        return $('//android.widget.TextView[@text="Mesh size (mm)"]');
    }

    get meshSizeField() {
        return $('//android.widget.EditText');
    }

    measurementFieldByIndex(index: number) {
        return $(`(//android.widget.EditText)[${index}]`);
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
