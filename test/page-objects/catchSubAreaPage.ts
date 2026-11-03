import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export class CatchSubAreaPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Select the statistical sub area") and @heading="true"]',
        );
    }

    get instructionText1() {
        return $('//android.widget.TextView[contains(@text, "The statistical areas nearest")]');
    }

    get instructionText2() {
        return $(
            '//android.widget.TextView[contains(@text, "Select the area where most of your catch was caught")]',
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
        return $(
            '//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Other"]]',
        );
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
        await option.waitForDisplayed({ timeout: 10000 });
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

    async selectOther() {
        logStep('Selecting Other');
        await this.otherOption.waitForDisplayed({ timeout: 10000 });
        await this.otherOption.click();
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

    async selectOtherAndContinue() {
        logStep('Selecting Other and continuing');
        await this.selectOther();
        await this.saveAndContinue();
    }
}

export default new CatchSubAreaPage();
