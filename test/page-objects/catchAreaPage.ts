import { BasePage } from './basePage';
import { logStep, logWarn } from '../common/logger';

export class CatchAreaPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Where was the majority of your catch caught") and @heading="true"]',
        );
    }

    get map() {
        return $('//android.view.View[contains(@content-desc, "Map of fisheries statistical")]');
    }

    get otherButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Other"]]',
        );
    }

    subAreaListItem(areaCode: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${areaCode}"]]`,
        );
    }

    selectedAreaText(areaCode: string) {
        return $(`//android.widget.TextView[@text="Selected area: ${areaCode}"]`);
    }

    get noAreaSelectedError() {
        return $(
            '//android.widget.TextView[@text="Select the statistical sub area where the majority of your catch was caught."]',
        );
    }

    // The selection state is announced in the map's content-desc, e.g. "... Selected area: 30F04 Drag to pan ...".
    private async getMapDescription(): Promise<string> {
        return (await this.map.getAttribute('content-desc')) ?? '';
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

    async selectRandomLocation() {
        logStep('Selecting a random location on the map');
        await this.map.waitForDisplayed();

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
        await this.otherButton.waitForDisplayed();
        await this.otherButton.click();
    }

    async isSubAreaListItemSelected(areaCode: string): Promise<boolean> {
        logStep(`Checking if sub area list item ${areaCode} is selected`);
        const item = this.subAreaListItem(areaCode);
        await this.scrollPastMapTo(item);
        await item.waitForDisplayed();
        return (await item.getAttribute('checked')) === 'true';
    }

    async isSelectedAreaTextDisplayed(areaCode: string): Promise<boolean> {
        logStep(`Checking if "Selected area: ${areaCode}" is displayed`);
        const text = this.selectedAreaText(areaCode);
        await this.scrollPastMapTo(text);
        return text.isDisplayed();
    }

    async isNoAreaSelectedErrorDisplayed(): Promise<boolean> {
        logStep('Checking if the no area selected error is displayed');
        await $(
            'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Select the statistical sub area where the majority of your catch was caught."))',
        );
        return this.noAreaSelectedError.isDisplayed();
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

    async getMapSnapshot(): Promise<string> {
        const map = await this.map;
        return browser.takeElementScreenshot(map.elementId);
    }

    async zoomMap(direction: 'in' | 'out') {
        logStep(`Zooming ${direction} on the map`);
        const { x, y } = await this.map.getLocation();
        const { width, height } = await this.map.getSize();
        const centreX = Math.floor(x + width / 2);
        const centreY = Math.floor(y + height / 2);
        const near = 20;
        const far = Math.floor(Math.min(width, height) / 3);
        // Zoom in spreads the fingers out from the centre; zoom out pinches them back to it.
        const [start, end] = direction === 'in' ? [near, far] : [far, near];

        const finger = (id: string, sign: 1 | -1) => ({
            type: 'pointer' as const,
            id,
            parameters: { pointerType: 'touch' as const },
            actions: [
                { type: 'pointerMove', duration: 0, x: centreX + sign * start, y: centreY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 600, x: centreX + sign * end, y: centreY },
                { type: 'pointerUp', button: 0 },
            ],
        });

        await browser.performActions([finger('finger1', -1), finger('finger2', 1)]);
        await browser.releaseActions();
        // Let the zoom animation settle before the next snapshot.
        await browser.pause(1500);
    }

    async dragMap(direction: 'up' | 'down' | 'left' | 'right') {
        logStep(`Dragging the map ${direction}`);
        await driver.execute('mobile: dragGesture', await this.dragPoints(direction));
        await browser.pause(500);
    }

    private async dragPoints(direction: 'up' | 'down' | 'left' | 'right') {
        const { x, y } = await this.map.getLocation();
        const { width, height } = await this.map.getSize();
        const centreX = Math.floor(x + width / 2);
        const centreY = Math.floor(y + height / 2);
        const dx = Math.floor(width / 4);
        const dy = Math.floor(height / 4);
        const ends = {
            up: { endX: centreX, endY: centreY - dy },
            down: { endX: centreX, endY: centreY + dy },
            left: { endX: centreX - dx, endY: centreY },
            right: { endX: centreX + dx, endY: centreY },
        };
        return { startX: centreX, startY: centreY, ...ends[direction] };
    }
}

export default new CatchAreaPage();
