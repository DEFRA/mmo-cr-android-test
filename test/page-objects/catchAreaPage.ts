import { BasePage } from './basePage';
import { logStep, logWarn } from '../common/logger';

export class CatchAreaPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Where was the majority of your catch caught") and @heading="true"]',
        );
    }

    get instructionText1() {
        return $('//android.widget.TextView[contains(@text, "The statistical areas nearest")]');
    }

    get instructionText2() {
        return $('//android.widget.TextView[contains(@text, "Select the area where most")]');
    }

    get instructionText3() {
        return $('//android.widget.TextView[contains(@text, "If it is not listed, select Other")]');
    }

    get map() {
        return $(
            '//android.view.View[contains(@content-desc, "Map of fisheries statistical sub-rectangles")]',
        );
    }

    get otherButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Other"]]',
        );
    }

    get selectedAreaText() {
        return $(
            '//android.widget.TextView[contains(@text, "area selected") or contains(@text, "Selected area")]',
        );
    }

    get noAreaSelectedText() {
        return $('//android.widget.TextView[@text="No area selected"]');
    }

    async getSelectedArea(): Promise<string> {
        logStep('Getting selected area text');
        await this.selectedAreaText.waitForDisplayed({ timeout: 1000 });
        return this.selectedAreaText.getText();
    }

    async getSelectedAreaCode(): Promise<string | null> {
        logStep('Getting selected area code');
        const text = await this.getSelectedArea();
        const match = text.match(/Selected area:\s*(.+)/);
        return match ? match[1].trim() : null;
    }

    async isAreaSelected(): Promise<boolean> {
        logStep('Checking if an area is selected');
        try {
            const text = await this.selectedAreaText.getText();
            return text.startsWith('Selected area:');
        } catch {
            return false;
        }
    }

    async tapMapAt(xPercent: number, yPercent: number) {
        logStep(`Tapping map at ${xPercent}%, ${yPercent}%`);
        await this.map.waitForDisplayed({ timeout: 10000 });

        const size = await this.map.getSize();
        const location = await this.map.getLocation();

        const x = Math.floor(size.width * xPercent) + location.x;
        const y = Math.floor(size.height * yPercent) + location.y;

        await browser.performActions([
            {
                type: 'pointer',
                id: 'catch-area-map-tap',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x, y },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
    }

    async selectRandomLocation() {
        logStep('Selecting a random location on the map');
        await this.map.waitForDisplayed({ timeout: 10000 });

        const size = await this.map.getSize();
        const location = await this.map.getLocation();

        for (let attempt = 0; attempt < 5; attempt++) {
            const x = Math.floor(size.width * (0.2 + Math.random() * 0.6)) + location.x;
            const y = Math.floor(size.height * (0.2 + Math.random() * 0.6)) + location.y;

            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'catch-area-map-tap',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x, y },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pointerUp', button: 0 },
                    ],
                },
            ]);

            try {
                await browser.pause(500);
                const text = await this.selectedAreaText.getText();
                if (text.startsWith('Selected area:')) {
                    logStep(`${text}`);
                    return;
                }
            } catch {
                logWarn(`CatchAreaPage: retry selectRandomLocation (attempt ${attempt + 1})`);
            }
        }

        throw new Error('Could not select a random catch area on the map.');
    }

    async clickOther() {
        logStep('Clicking Other');
        await this.otherButton.waitForDisplayed({ timeout: 10000 });
        await this.otherButton.click();
    }

    async selectRandomLocationAndContinue() {
        logStep('Selecting random location and continuing');
        await this.selectRandomLocation();
        await this.saveAndContinue();
    }

    async clickOtherAndContinue() {
        logStep('Clicking Other and continuing');
        await this.clickOther();
    }
}

export default new CatchAreaPage();
