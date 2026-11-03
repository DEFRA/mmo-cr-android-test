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
        return $('//android.view.View[contains(@content-desc, "Map of fisheries statistical")]');
    }

    get otherButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Other"]]',
        );
    }

    // The selection state is announced in the map's content-desc, e.g. "... Selected area: 30F04 Drag to pan ...".
    get selectedAreaText() {
        return $('//android.view.View[contains(@content-desc, "Selected area:")]');
    }

    get noAreaSelectedText() {
        return $('//android.view.View[contains(@content-desc, "No area selected")]');
    }

    private async getMapDescription(): Promise<string> {
        return (await this.map.getAttribute('content-desc')) ?? '';
    }

    async getSelectedArea(): Promise<string> {
        logStep('Getting selected area text');
        await this.selectedAreaText.waitForExist({ timeout: 1000 });
        const match = (await this.getMapDescription()).match(/Selected area:\s*\S+/);
        return match?.[0] ?? '';
    }

    async getSelectedAreaCode(): Promise<string | null> {
        logStep('Getting selected area code');
        const match = (await this.getMapDescription()).match(/Selected area:\s*(\S+)/);
        return match?.[1] ?? null;
    }

    async isAreaSelected(): Promise<boolean> {
        logStep('Checking if an area is selected');
        return (await this.getMapDescription()).includes('Selected area:');
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
            // The departure port sits mid-map with land above it, so tap the lower part where the sea sub-areas are.
            const x = Math.floor(size.width * (0.2 + Math.random() * 0.6)) + location.x;
            const y = Math.floor(size.height * (0.65 + Math.random() * 0.25)) + location.y;

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

            await browser.pause(500);
            if (await this.isAreaSelected()) {
                logStep(`Selected area: ${await this.getSelectedAreaCode()}`);
                return;
            }
            logWarn(`CatchAreaPage: retry selectRandomLocation (attempt ${attempt + 1})`);
        }

        throw new Error('Could not select a random catch area on the map.');
    }

    // Swipes in the page margin beside the map, because swiping on the map pans it instead of scrolling the page.
    private async scrollPastMapTo(target: ChainablePromiseElement) {
        const { x: mapX } = await this.map.getLocation();
        await this.scrollUntilDisplayed(target, { swipeX: Math.max(1, Math.floor(mapX / 2)) });
    }

    async clickOther() {
        logStep('Clicking Other');
        await this.scrollPastMapTo(this.otherButton);
        await this.otherButton.waitForDisplayed({ timeout: 10000 });
        await this.otherButton.click();
    }

    override async saveAndContinue() {
        await this.scrollPastMapTo(this.saveAndContinueButton);
        await super.saveAndContinue();
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
